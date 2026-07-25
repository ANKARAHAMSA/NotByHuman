function setupContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "notbyhuman_analyze",
      title: "🛡️ Analyze selection with NotByHuman",
      contexts: ["selection"]
    });
  });
}

chrome.runtime.onInstalled.addListener(setupContextMenu);
chrome.runtime.onStartup.addListener(setupContextMenu);

// Execute context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "notbyhuman_analyze" && info.selectionText && tab?.id) {
    const selectedText = info.selectionText.trim();
    if (!selectedText) return;

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText })
      });

      const data = await response.json();

      if (response.ok) {
        // Set action badge on extension icon
        chrome.action.setBadgeText({ text: `${data.ai_percentage}%` });
        chrome.action.setBadgeBackgroundColor({
          color: data.ai_percentage >= 70 ? '#f43f5e' : data.ai_percentage >= 45 ? '#f59e0b' : '#10b981'
        });

        // Show Desktop Notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon-128.png",
          title: `NotByHuman: ${data.ai_percentage}% AI (${data.classification})`,
          message: data.verdict_summary
        });

        // Inject floating toast directly into the active webpage
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: showOnPageToast,
          args: [data.ai_percentage, data.classification, data.verdict_summary]
        });
      } else {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: showOnPageToast,
          args: [0, "Warning", data.detail || "Selection is too short (min ~15 words)."]
        });
      }
    } catch (e) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showOnPageToast,
        args: [0, "Connection Error", "Could not connect to NotByHuman server (http://localhost:8000). Ensure backend is running."]
      });
    }
  }
});

// Function injected into target webpage to display an instant floating glassmorphic toast
function showOnPageToast(percentage, title, message) {
  let existing = document.getElementById("notbyhuman-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "notbyhuman-toast";
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.zIndex = "2147483647";
  toast.style.background = "rgba(18, 25, 41, 0.95)";
  toast.style.backdropFilter = "blur(12px)";
  toast.style.webkitBackdropFilter = "blur(12px)";
  toast.style.color = "#f1f5f9";
  toast.style.border = "1px solid rgba(255, 255, 255, 0.18)";
  toast.style.borderRadius = "12px";
  toast.style.padding = "16px 20px";
  toast.style.boxShadow = "0 20px 40px rgba(0,0,0,0.5)";
  toast.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  toast.style.maxWidth = "360px";
  toast.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

  let badgeColor = "#10b981";
  if (percentage >= 70) badgeColor = "#f43f5e";
  else if (percentage >= 45) badgeColor = "#f59e0b";

  toast.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
      <div style="font-weight:700; font-size:1rem; color:${badgeColor}; display:flex; align-items:center; gap:6px;">
        🛡️ NotByHuman
      </div>
      <span style="background:${badgeColor}22; color:${badgeColor}; border:1px solid ${badgeColor}44; padding:2px 8px; border-radius:99px; font-weight:800; font-size:0.8rem;">
        ${percentage > 0 ? percentage + '% AI' : title}
      </span>
    </div>
    <div style="font-size:0.88rem; color:#cbd5e1; line-height:1.5;">
      ${message}
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 6000);
}
