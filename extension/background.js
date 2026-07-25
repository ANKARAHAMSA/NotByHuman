chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "notbyhuman_analyze",
    title: "Analyze selection with NotByHuman",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "notbyhuman_analyze" && info.selectionText) {
    const selectedText = info.selectionText.trim();
    if (!selectedText) return;

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Show notification with real PNG icon
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon-128.png",
          title: `NotByHuman: ${data.ai_percentage}% AI Probability`,
          message: `${data.classification} — ${data.verdict_summary}`
        });

        // Set action badge on icon
        chrome.action.setBadgeText({ text: `${data.ai_percentage}%` });
        chrome.action.setBadgeBackgroundColor({
          color: data.ai_percentage >= 70 ? '#f43f5e' : data.ai_percentage >= 45 ? '#f59e0b' : '#10b981'
        });
      } else {
        const errData = await response.json().catch(() => ({}));
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon-128.png",
          title: "NotByHuman Analysis Warning",
          message: errData.detail || "Selection is too short (min ~15 words)."
        });
      }
    } catch (e) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon-128.png",
        title: "NotByHuman Connection Error",
        message: "Could not connect to backend server (http://localhost:8000)."
      });
    }
  }
});
