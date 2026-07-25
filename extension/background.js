chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "notbyhuman_analyze",
    title: "Analyze selection with NotByHuman",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "notbyhuman_analyze" && info.selectionText) {
    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: info.selectionText })
      });
      if (response.ok) {
        const data = await response.json();
        chrome.notifications.create({
          type: "basic",
          iconUrl: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>",
          title: `NotByHuman: ${data.ai_percentage}% AI Probability`,
          message: `${data.classification} — ${data.verdict_summary}`
        });
      }
    } catch (e) {
      console.error("NotByHuman context menu error:", e);
    }
  }
});
