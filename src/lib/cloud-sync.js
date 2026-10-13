const endpoint =
  "https://api.github.com/repos/jeanzz2026/wangamiao-2027-race-calendar";
let queue = Promise.resolve();
export async function request(url, token, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const text = await response.text(); // Timeout covers the body, not just headers.
    return { ok: response.ok, status: response.status, text };
  } finally {
    clearTimeout(timeout);
  }
}
export async function readCloudState(token, knownSha) {
  try {
    const metadata = await request(
      `${endpoint}/contents/state.json?ref=main`,
      token,
    );
    if (!metadata.ok) return null;
    const info = JSON.parse(metadata.text);
    if (!info.sha) return null;
    if (knownSha && knownSha === info.sha)
      return { unchanged: true, sha: info.sha };
    let text;
    if (info.content && info.encoding === "base64") {
      const binary = atob(info.content.replace(/\s/g, ""));
      text = new TextDecoder().decode(
        Uint8Array.from(binary, (c) => c.charCodeAt(0)),
      );
    } else {
      // Pin the body to the metadata blob SHA: supports images / files > 1 MB.
      const body = await request(`${endpoint}/git/blobs/${info.sha}`, token, {
        headers: { Accept: "application/vnd.github.raw+json" },
      });
      if (!body.ok) return null;
      text = body.text;
    }
    const state = JSON.parse(text);
    if (!state || typeof state !== "object" || Array.isArray(state))
      return null;
    return { state, sha: info.sha };
  } catch {
    return null;
  }
}
function base64(text) {
  const bytes = new TextEncoder().encode(text);
  const pieces = [];
  for (let i = 0; i < bytes.length; i += 8192)
    pieces.push(String.fromCharCode(...bytes.subarray(i, i + 8192)));
  return btoa(pieces.join(""));
}
export function writeCloudState(state, token, getExpectedSha) {
  const task = queue.then(async () => {
    try {
      const expected = getExpectedSha();
      const metadata = await request(
        `${endpoint}/contents/state.json?ref=main`,
        token,
      );
      if (!metadata.ok)
        return {
          ok: false,
          reason: `读取云端版本失败 HTTP ${metadata.status}`,
        };
      const info = JSON.parse(metadata.text);
      if (!expected || expected !== info.sha)
        return {
          ok: false,
          conflict: true,
          reason: "云端已有更新，已保留本机改动；请先下载核对，未覆盖云端",
        };
      const response = await request(`${endpoint}/contents/state.json`, token, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Update training and race state (via app)",
          branch: "main",
          sha: info.sha,
          content: base64(JSON.stringify(state)),
        }),
      });
      if (!response.ok)
        return {
          ok: false,
          conflict: response.status === 409,
          reason:
            response.status === 403
              ? "无写入权限，请检查 Token Contents 权限"
              : response.status === 401
                ? "Token 已失效，请重新连接"
                : `HTTP ${response.status}`,
        };
      return { ok: true, sha: JSON.parse(response.text).content?.sha };
    } catch (error) {
      return {
        ok: false,
        reason:
          error.name === "AbortError"
            ? "同步超时，本机数据已保留，请重试"
            : "网络错误，本机数据已保留",
      };
    }
  });
  queue = task.catch(() => {});
  return task;
}
