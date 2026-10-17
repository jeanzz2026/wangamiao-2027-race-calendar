import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  uploadImage,
  imageId,
  imageDataUrl,
  MAX_IMAGE_BYTES,
} from "../src/lib/image-uploads.js";
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
const API =
  "https://api.github.com/repos/jeanzz2026/wangamiao-2027-race-calendar";
const MEDIA_BASE = "https://jeanzz2026.github.io/wangamiao-2027-race-calendar";
async function gitSha(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const header = new TextEncoder().encode(`blob ${bytes.length}\0`);
  const all = new Uint8Array(header.length + bytes.length);
  all.set(header);
  all.set(bytes, header.length);
  return Buffer.from(await crypto.subtle.digest("SHA-1", all)).toString("hex");
}
const make = (n) =>
  new Blob([new Uint8Array([255, 216, 255, n, 255, 217])], {
    type: "image/jpeg",
  });
test("image is stored independently, verified by blob SHA and returns a Pages URL", async () => {
  const blob = make(1),
    sha = await gitSha(blob),
    id = await imageId(blob);
  let put, verification;
  globalThis.fetch = async (url, options = {}) => {
    if (String(url) === `${API}/git/blobs/${sha}`) {
      verification = options;
      return new Response(await blob.arrayBuffer());
    }
    if (
      String(url) === `${API}/contents/uploads/takeaway/${id}.jpg` &&
      options.method === "PUT"
    ) {
      put = JSON.parse(options.body);
      return new Response(
        JSON.stringify({ content: { sha }, commit: { sha: "a".repeat(40) } }),
      );
    }
    assert.equal(
      String(url),
      `${API}/contents/uploads/takeaway/${id}.jpg?ref=main`,
    );
    return new Response("{}", { status: 404 });
  };
  const result = await uploadImage(blob, "fake");
  assert.equal(result.id, id);
  assert.equal(result.url, `${MEDIA_BASE}/uploads/takeaway/${id}.jpg`);
  assert.equal(verification.headers.Accept, "application/vnd.github.raw+json");
  assert.equal(verification.headers.Authorization, "Bearer fake");
  assert.equal(verification.cache, "no-store");
  assert.deepEqual(
    Buffer.from(put.content, "base64"),
    Buffer.from(await blob.arrayBuffer()),
  );
  assert.equal(put.branch, "main");
});
test("concurrent same image requests deduplicate to one PUT", async () => {
  const blob = make(2),
    sha = await gitSha(blob);
  let puts = 0;
  globalThis.fetch = async (url, options = {}) => {
    if (String(url) === `${API}/git/blobs/${sha}`)
      return new Response(await blob.arrayBuffer());
    if (options.method === "PUT") {
      puts++;
      return new Response(
        JSON.stringify({ content: { sha }, commit: { sha: "b".repeat(40) } }),
      );
    }
    return new Response("{}", { status: 404 });
  };
  const results = await Promise.all([
    uploadImage(blob, "fake"),
    uploadImage(blob, "fake"),
  ]);
  assert.equal(puts, 1);
  assert.equal(
    results[0].url,
    `${MEDIA_BASE}/uploads/takeaway/${await imageId(blob)}.jpg`,
  );
  assert.equal(results[0].url, results[1].url);
});
test("existing matching file is reused without overwriting", async () => {
  const blob = make(3),
    sha = await gitSha(blob);
  let puts = 0;
  globalThis.fetch = async (url, options = {}) => {
    if (String(url) === `${API}/git/blobs/${sha}`)
      return new Response(await blob.arrayBuffer());
    if (options.method === "PUT") puts++;
    assert.equal(
      String(url),
      `${API}/contents/uploads/takeaway/${await imageId(blob)}.jpg?ref=main`,
    );
    return new Response(JSON.stringify({ sha }));
  };
  assert.equal(
    (await uploadImage(blob, "fake")).url,
    `${MEDIA_BASE}/uploads/takeaway/${await imageId(blob)}.jpg`,
  );
  assert.equal(puts, 0);
});
test("403 is an upload failure rather than a false success", async () => {
  globalThis.fetch = async (url, options = {}) =>
    new Response("{}", { status: options.method === "PUT" ? 403 : 404 });
  await assert.rejects(uploadImage(make(4), "fake"), /权限/);
});
test("mismatched downloaded bytes prevent publishing a link", async () => {
  const blob = make(5),
    sha = await gitSha(blob);
  globalThis.fetch = async (url, options = {}) => {
    if (String(url) === `${API}/git/blobs/${sha}`)
      return new Response("wrong bytes");
    return options.method === "PUT"
      ? new Response(
          JSON.stringify({ content: { sha }, commit: { sha: "d".repeat(40) } }),
        )
      : new Response("{}", { status: 404 });
  };
  await assert.rejects(uploadImage(blob, "fake"), /校验失败/);
});
test("token, file size and MIME are validated before writing", async () => {
  await assert.rejects(uploadImage(make(6), ""), /登录/);
  await assert.rejects(
    uploadImage(
      new Blob([new Uint8Array(MAX_IMAGE_BYTES + 1)], { type: "image/jpeg" }),
      "fake",
    ),
    /1 MB/,
  );
  await assert.rejects(
    uploadImage(new Blob(["<svg/>"], { type: "image/svg+xml" }), "fake"),
    /JPEG/,
  );
  assert.match(await imageDataUrl(make(7)), /^data:image\/jpeg;base64,/);
});

test("blob verification HTTP failure publishes no link and permits retry", async () => {
  const blob = make(8),
    sha = await gitSha(blob);
  let reads = 0;
  globalThis.fetch = async (url, options = {}) => {
    assert.notEqual(options.method, "PUT");
    if (String(url) === `${API}/git/blobs/${sha}`) {
      reads++;
      return reads === 1
        ? new Response("unavailable", { status: 503 })
        : new Response(await blob.arrayBuffer());
    }
    assert.equal(
      String(url),
      `${API}/contents/uploads/takeaway/${await imageId(blob)}.jpg?ref=main`,
    );
    return new Response(JSON.stringify({ sha }));
  };
  await assert.rejects(uploadImage(blob, "fake"), /读取验证失败 HTTP 503/);
  const result = await uploadImage(blob, "fake");
  assert.equal(
    result.url,
    `${MEDIA_BASE}/uploads/takeaway/${await imageId(blob)}.jpg`,
  );
  assert.equal(
    reads,
    2,
    "failed verification must not cache a successful upload",
  );
});
