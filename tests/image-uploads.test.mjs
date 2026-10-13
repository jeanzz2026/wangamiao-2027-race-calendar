import test from "node:test";
import assert from "node:assert/strict";
import {
  uploadImage,
  imageId,
  imageDataUrl,
  MAX_IMAGE_BYTES,
} from "../src/lib/image-uploads.js";
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
test("image is stored independently and immutable raw URL is verified", async () => {
  const blob = make(1),
    sha = await gitSha(blob),
    id = await imageId(blob);
  let put;
  globalThis.fetch = async (url, options = {}) => {
    if (String(url).includes("raw.githubusercontent.com"))
      return new Response(await blob.arrayBuffer());
    if (options.method === "PUT") {
      put = JSON.parse(options.body);
      return new Response(
        JSON.stringify({ content: { sha }, commit: { sha: "a".repeat(40) } }),
      );
    }
    return new Response("{}", { status: 404 });
  };
  const result = await uploadImage(blob, "fake");
  assert.equal(result.id, id);
  assert.match(result.url, new RegExp(`/a{40}/uploads/takeaway/${id}\\.jpg$`));
  assert.equal(Buffer.from(put.content, "base64").length, blob.size);
  assert.equal(put.branch, "main");
});
test("concurrent same image requests deduplicate to one PUT", async () => {
  const blob = make(2),
    sha = await gitSha(blob);
  let puts = 0;
  globalThis.fetch = async (url, options = {}) => {
    if (String(url).includes("raw.githubusercontent.com"))
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
  assert.equal(results[0].url, results[1].url);
});
test("existing matching file is reused without overwriting", async () => {
  const blob = make(3),
    sha = await gitSha(blob);
  let puts = 0;
  globalThis.fetch = async (url, options = {}) => {
    if (String(url).includes("raw.githubusercontent.com"))
      return new Response(await blob.arrayBuffer());
    if (options.method === "PUT") puts++;
    return new Response(
      JSON.stringify(
        String(url).includes("/git/ref/")
          ? { object: { sha: "c".repeat(40) } }
          : { sha },
      ),
    );
  };
  assert.match((await uploadImage(blob, "fake")).url, /c{40}/);
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
    if (String(url).includes("raw.githubusercontent.com"))
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
