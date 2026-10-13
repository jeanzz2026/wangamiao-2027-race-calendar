export function hasCommentContent(html) {
  const container = document.createElement("div");
  container.innerHTML = html;
  return Boolean(
    container.textContent.replace(/\u00a0/g, " ").trim() ||
      container.querySelector("img[src]"),
  );
}
