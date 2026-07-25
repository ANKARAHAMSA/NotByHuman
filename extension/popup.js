const API_URL = "http://localhost:8000/api/analyze";

document.addEventListener('DOMContentLoaded', async () => {
  const textInput = document.getElementById('textInput');
  const scanBtn = document.getElementById('scanBtn');
  const resultBox = document.getElementById('resultBox');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const riskBadge = document.getElementById('riskBadge');
  const verdictText = document.getElementById('verdictText');

  // Load selection if available from content or storage
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      });
      if (result && result.trim()) {
        textInput.value = result.trim();
      }
    } catch (e) {
      // Ignored on internal chrome:// pages
    }
  }

  scanBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text) return;

    scanBtn.disabled = true;
    scanBtn.textContent = 'Extracting...';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      resultBox.style.display = 'block';
      scoreDisplay.textContent = `${data.ai_percentage}% AI`;
      verdictText.textContent = data.verdict_summary;

      riskBadge.className = 'badge';
      if (data.ai_percentage >= 70) {
        riskBadge.classList.add('badge-rose');
        riskBadge.textContent = 'High AI Risk';
      } else if (data.ai_percentage >= 45) {
        riskBadge.classList.add('badge-amber');
        riskBadge.textContent = 'Mixed Risk';
      } else {
        riskBadge.classList.add('badge-green');
        riskBadge.textContent = 'Human Flow';
      }
    } catch (err) {
      alert('Could not connect to NotByHuman server (http://localhost:8000). Ensure backend is running.');
    } finally {
      scanBtn.disabled = false;
      scanBtn.textContent = 'Analyze Text';
    }
  });
});
