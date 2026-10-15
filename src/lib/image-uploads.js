import { request, enqueueCloudWrite } from "./cloud-sync.js";
import { readEditorDraft, clearEditorDraft } from "./local-state.js";

const API =
  "https://api.github.com/repos/jeanzz2026/wangamiao-2027-race-calendar";
// 图片走 GitHub Pages 同源地址：不写死 commit（抗 squash 合并），且对国内访问更稳
const MEDIA_BASE = "https://jeanzz2026.github.io/wangamiao-2027-race-calendar";
export const MAX_IMAGE_BYTES = 1024 * 1024;
const inFlight = new Map();
const uploaded = new Map();
function hex(buffer) {
  return Array.from(new Uint8Array(buffer), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
export async function imageId(blob) {
  return hex(await crypto.subtle.digest("SHA-256", await blob.arrayBuffer()));
}
export async function imageDataUrl(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const parts = [];
  for (let i = 0; i < bytes.length; i += 8192)
    parts.push(String.fromCharCode(...bytes.subarray(i, i + 8192)));
  return `data:image/jpeg;base64,${btoa(parts.join(""))}`;
}
export async function compressImage(file) {
  if (
    !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
  )
    throw new Error("请使用 JPG、PNG、WebP 或 GIF 图片；GIF 将保存静态画面");
  if (file.size > 25 * 1024 * 1024)
    throw new Error("原图超过 25 MB，请先缩小后重试");
  const bitmap = await createImageBitmap(file);
  try {
    if (
      !bitmap.width ||
      !bitmap.height ||
      bitmap.width * bitmap.height > 80000000
    )
      throw new Error("图片分辨率过大，请先缩小后重试");
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.82, 0.7, 0.58, 0.45]) {
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (blob && blob.size <= MAX_IMAGE_BYTES)
        return { blob, width: canvas.width, height: canvas.height };
    }
    throw new Error("图片压缩后仍超过 1 MB，请缩小或裁剪后重试");
  } finally {
    bitmap.close();
  }
}
async function gitBlobSha(bytes) {
  const header = new TextEncoder().encode(`blob ${bytes.length}\0`);
  const content = new Uint8Array(header.length + bytes.length);
  content.set(header);
  content.set(bytes, header.length);
  return hex(await crypto.subtle.digest("SHA-1", content));
}
// 通过 GitHub API 的 blob 接口按内容哈希校验（实时、不依赖 Pages 构建延迟，且 api.github.com 对国内更稳）
async function verifyImage(id, expectedBlob, token) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(`${API}/git/blobs/${expectedBlob}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github.raw+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok)
      throw new Error(`图片读取验证失败 HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (
      bytes.byteLength > MAX_IMAGE_BYTES ||
      hex(await crypto.subtle.digest("SHA-256", bytes)) !== id
    )
      throw new Error("图片读取校验失败");
  } finally {
    clearTimeout(timer);
  }
}
export async function uploadImage(blob, token) {
  if (!token) throw new Error("请先登录 GitHub，图片草稿已保留在本机");
  if (blob.type !== "image/jpeg" || blob.size > MAX_IMAGE_BYTES)
    throw new Error("只允许上传压缩后的 JPEG 图片（不超过 1 MB）");
  const id = await imageId(blob);
  if (uploaded.has(id)) return { id, url: uploaded.get(id) };
  if (inFlight.has(id)) return inFlight.get(id);
  const promise = enqueueCloudWrite(async () => {
    const path = `uploads/takeaway/${id}.jpg`;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const expectedBlob = await gitBlobSha(bytes);
    const metadata = await request(`${API}/contents/${path}?ref=main`, token);
    if (metadata.ok) {
      if (JSON.parse(metadata.text).sha !== expectedBlob)
        throw new Error("同名图片内容不一致，未覆盖仓库文件");
    } else if (metadata.status === 404) {
      const result = await request(`${API}/contents/${path}`, token, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Upload compressed Takeaway image",
          branch: "main",
          content: (await imageDataUrl(blob)).split(",")[1],
        }),
      });
      if (!result.ok)
        throw new Error(
          result.status === 403
            ? "图片上传无写入权限，请检查 Token Contents 权限"
            : `图片上传失败 HTTP ${result.status}，草稿已保留`,
        );
      const info = JSON.parse(result.text);
      if (info.content?.sha !== expectedBlob)
        throw new Error("仓库图片保存校验失败");
    } else throw new Error(`图片查询失败 HTTP ${metadata.status}`);
    const url = `${MEDIA_BASE}/${path}`;
    await verifyImage(id, expectedBlob, token);
    uploaded.set(id, url);
    return { id, url };
  });
  inFlight.set(id, promise);
  try {
    return await promise;
  } finally {
    inFlight.delete(id);
  }
}
export function resolveUploadedImages(takeaways, urls) {
  if (!Object.keys(urls).length) return takeaways;
  let changed = false;
  const result = { ...takeaways };
  for (const [key, record] of Object.entries(takeaways || {})) {
    if (!record.comments?.includes("data-attachment-id")) continue;
    const container = document.createElement("div");
    container.innerHTML = record.comments;
    let edited = false;
    for (const image of container.querySelectorAll("img[data-attachment-id]")) {
      const url = urls[image.getAttribute("data-attachment-id")];
      if (url) {
        image.src = url;
        image.removeAttribute("data-attachment-id");
        edited = true;
      }
    }
    if (edited) {
      result[key] = { ...record, comments: container.innerHTML };
      changed = true;
    }
  }
  return changed ? result : takeaways;
}
export async function prepareStateImages(state, token) {
  const urls = {};
  for (const record of Object.values(state.takeaways || {})) {
    if (!record.comments?.includes("data-attachment-id")) continue;
    const container = document.createElement("div");
    container.innerHTML = record.comments;
    for (const image of container.querySelectorAll("img[data-attachment-id]")) {
      const id = image.getAttribute("data-attachment-id");
      if (!/^[a-f0-9]{64}$/.test(id)) throw new Error("图片草稿标识无效");
      if (urls[id]) continue;
      const source = image.getAttribute("src") || "";
      if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(source))
        throw new Error("图片草稿格式无效");
      if (source.length > MAX_IMAGE_BYTES * 1.4 + 100)
        throw new Error("图片草稿过大");
      const binary = atob(source.split(",")[1]);
      const blob = new Blob([Uint8Array.from(binary, (c) => c.charCodeAt(0))], {
        type: "image/jpeg",
      });
      if ((await imageId(blob)) !== id) throw new Error("图片草稿内容校验失败");
      urls[id] = (await uploadImage(blob, token)).url;
    }
  }
  return {
    state: {
      ...state,
      takeaways: resolveUploadedImages(state.takeaways, urls),
    },
    uploads: urls,
  };
}
export async function clearPublishedDraft(state, urls) {
  try {
    const draft = await readEditorDraft();
    if (
      draft?.uid &&
      state.takeaways?.[draft.uid]?.comments ===
        resolveUploadedImages({ draft }, urls).draft.comments
    )
      await clearEditorDraft();
  } catch {}
}
