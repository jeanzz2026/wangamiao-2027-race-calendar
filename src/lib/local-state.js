const KEY = "wamiao_state_v2";
const RECEIPT = "wamiao_synced_fingerprint_v1";
function database() {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open("wamiao-state", 1);
    open.onupgradeneeded = () => open.result.createObjectStore("state");
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
}
async function access(mode, value, key = KEY) {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("state", mode);
      const request =
        mode === "readonly"
          ? tx.objectStore("state").get(key)
          : tx.objectStore("state").put(value, key);
      tx.oncomplete = () =>
        resolve(mode === "readonly" ? request.result : true);
      tx.onabort = tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
export async function readLocalState() {
  try {
    const value = await access("readonly");
    if (value) return value;
  } catch {}
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}
export async function writeLocalState(state) {
  // IndexedDB stores embedded images beyond localStorage's small quota.
  try {
    await access("readwrite", state);
    return true;
  } catch {}
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
export async function backupLocalState(state) {
  try {
    await access("readwrite", state, "before-cloud-download");
    return true;
  } catch {
    return false;
  }
}
export async function readLocalBackup() {
  return access("readonly", undefined, "before-cloud-download");
}
export async function writeEditorDraft(draft) {
  await access("readwrite", draft, "takeaway-image-draft");
}
export async function readEditorDraft() {
  return access("readonly", undefined, "takeaway-image-draft");
}
export async function clearEditorDraft() {
  await access("readwrite", null, "takeaway-image-draft");
}
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .filter((k) => value[k] !== undefined)
        .map((k) => [k, stable(value[k])]),
    );
  return value;
}
export async function fingerprint(state) {
  const normalized = {
    ...state,
    raceEdits: state.raceEdits || {},
    takeaways: state.takeaways || {},
  };
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(stable(normalized))),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
export async function markSynced(state) {
  try {
    localStorage.setItem(RECEIPT, await fingerprint(state));
  } catch {}
}
export async function isSynced(state) {
  try {
    return localStorage.getItem(RECEIPT) === (await fingerprint(state));
  } catch {
    return false;
  }
}
