import test from "node:test";
import assert from "node:assert/strict";
import { readCloudState, writeCloudState } from "../src/lib/cloud-sync.js";
import {
  loadCloudState,
  saveCloudState,
} from "../src/lib/application-support.js";
import { fingerprint, isSynced, markSynced } from "../src/lib/local-state.js";
const values = new Map();
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
};

test("large image state reads raw blob pinned to metadata SHA", async () => {
  const state = {
    takeaways: {
      one: {
        comments: `<img src="data:image/png;base64,${"A".repeat(2 * 1024 * 1024)}">`,
      },
    },
  };
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify(
        String(url).includes("/contents/")
          ? { sha: "large-sha", encoding: "none", content: "" }
          : state,
      ),
    );
  };
  const result = await readCloudState("fake");
  assert.equal(result.sha, "large-sha");
  assert.equal(
    result.state.takeaways.one.comments,
    state.takeaways.one.comments,
  );
  assert.match(calls[1].url, /git\/blobs\/large-sha$/);
  assert.equal(
    calls[1].options.headers.Accept,
    "application/vnd.github.raw+json",
  );
});
test("UTF-8 small state decodes correctly", async () => {
  const state = { takeaways: { one: { comments: "中文 🐱" } } };
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        sha: "small-sha",
        encoding: "base64",
        content: Buffer.from(JSON.stringify(state)).toString("base64"),
      }),
    );
  assert.deepEqual((await readCloudState()).state, state);
});
test("actual application wrapper retains large-file SHA and PUT includes it", async () => {
  let put;
  globalThis.fetch = async (url, options = {}) => {
    if (options.method === "PUT") {
      put = JSON.parse(options.body);
      return new Response(JSON.stringify({ content: { sha: "new-sha" } }));
    }
    return new Response(
      JSON.stringify(
        String(url).includes("/contents/")
          ? { sha: "large-sha", content: "", encoding: "none" }
          : { takeaways: {} },
      ),
    );
  };
  const loaded = await loadCloudState("fake");
  const result = await saveCloudState(
    {
      ...loaded.state,
      takeaways: {
        one: { comments: '<img src="data:image/png;base64,AA==">' },
      },
    },
    "fake",
  );
  assert.equal(result.ok, true);
  assert.equal(put.sha, "large-sha");
  assert.match(Buffer.from(put.content, "base64").toString(), /data:image/);
});
test("stale device cannot silently overwrite another device", async () => {
  let puts = 0;
  globalThis.fetch = async (url, options = {}) => {
    if (options.method === "PUT") puts++;
    return new Response(JSON.stringify({ sha: "other-device-sha" }));
  };
  const result = await writeCloudState(
    { takeaways: {} },
    "fake",
    () => "old-sha",
  );
  assert.equal(result.conflict, true);
  assert.equal(puts, 0);
});
test("409 conflict is not retried with a newer SHA", async () => {
  let puts = 0;
  globalThis.fetch = async (url, options = {}) => {
    if (options.method === "PUT") {
      puts++;
      return new Response("{}", { status: 409 });
    }
    return new Response(JSON.stringify({ sha: "expected" }));
  };
  const result = await writeCloudState({}, "fake", () => "expected");
  assert.equal(result.conflict, true);
  assert.equal(puts, 1);
});
test("queued saves advance the SHA in order without overlapping PUTs", async () => {
  let sha = "first",
    active = 0,
    max = 0;
  globalThis.fetch = async (url, options = {}) => {
    if (options.method === "PUT") {
      active++;
      max = Math.max(max, active);
      await new Promise((r) => setTimeout(r, 10));
      assert.equal(JSON.parse(options.body).sha, sha);
      sha += "-next";
      active--;
      return new Response(JSON.stringify({ content: { sha } }));
    }
    if (String(url).includes("/git/blobs/")) return new Response("{}");
    return new Response(JSON.stringify({ sha, content: "", encoding: "none" }));
  };
  await loadCloudState("fake");
  const results = await Promise.all([
    saveCloudState({ a: 1 }, "fake"),
    saveCloudState({ a: 2 }, "fake"),
  ]);
  assert.ok(results.every((x) => x.ok));
  assert.equal(max, 1);
});
test("sync receipt distinguishes clean cache from unsynced edits", async () => {
  const a = { takeaways: { a: { comments: "原评论" } } },
    b = { takeaways: { a: { comments: "新评论" } } };
  await markSynced(a);
  assert.equal(await isSynced(a), true);
  assert.equal(await isSynced(b), false);
  assert.equal(
    await fingerprint({ a: 1, b: 2 }),
    await fingerprint({ b: 2, a: 1 }),
  );
});
test("body abort does not report a successful cloud write", async () => {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    text: async () => {
      throw new DOMException("aborted", "AbortError");
    },
  });
  const result = await writeCloudState({}, "fake", () => "sha");
  assert.equal(result.ok, false);
  assert.match(result.reason, /超时/);
});
