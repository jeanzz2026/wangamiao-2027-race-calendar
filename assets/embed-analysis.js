(() => {
  const streamlitUrl = "https://trail-race-lab.streamlit.app/?embed=true";
  const externalUrl = "https://trail-race-lab.streamlit.app";

  function mountEmbeddedAnalysis() {
    const page = document.querySelector("section.analysis-page");
    if (!page || page.dataset.streamlitEmbedded === "true") return;

    page.dataset.streamlitEmbedded = "true";
    page.replaceChildren();

    const head = document.createElement("div");
    head.className = "analysis-embed-head";

    const copy = document.createElement("div");
    copy.className = "analysis-embed-copy";
    copy.innerHTML = `
      <h3>TRAIL RACE LAB</h3>
      <p class="al-desc">赛事数据与技术分析由 Trail Race Lab 提供，可直接在当前页面内操作。首次打开 Streamlit 约需 30 秒至 1 分钟，请耐心等待。</p>
    `;

    const externalLink = document.createElement("a");
    externalLink.className = "al-open";
    externalLink.href = externalUrl;
    externalLink.target = "_blank";
    externalLink.rel = "noopener noreferrer";
    externalLink.innerHTML = '独立打开 <span aria-hidden="true">↗</span>';

    const frameWrap = document.createElement("div");
    frameWrap.className = "analysis-frame-wrap";

    const frame = document.createElement("iframe");
    frame.className = "analysis-frame";
    frame.title = "Trail Race Lab 越野赛事数据实验室";
    frame.loading = "lazy";
    frame.allow = "clipboard-read; clipboard-write";
    frame.referrerPolicy = "strict-origin-when-cross-origin";

    head.append(copy, externalLink);
    frameWrap.append(frame);
    page.append(head, frameWrap);

    // The analysis tab is hidden on the initial race-plan screen. Do not start
    // the Streamlit app until the iframe is actually visible to the user.
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        frame.src = streamlitUrl;
        observer.disconnect();
      });
      observer.observe(frameWrap);
    } else {
      frame.src = streamlitUrl;
    }
  }

  const observer = new MutationObserver(mountEmbeddedAnalysis);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  mountEmbeddedAnalysis();
})();
