const API_URL = "http://localhost:8000/api/analyze";

document.addEventListener('DOMContentLoaded', async () => {
  const textInput = document.getElementById('textInput');
  const scanBtn = document.getElementById('scanBtn');
  const resultBox = document.getElementById('resultBox');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const riskBadge = document.getElementById('riskBadge');
  const verdictText = document.getElementById('verdictText');

  // Load current page text selection if present
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      });
      if (result && result.trim()) {
        textInput.value = result.trim();
      }
    }
  } catch (e) {
    // Ignore restricted extension or chrome pages
  }

  scanBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text) {
      alert("Please enter or highlight text to analyze.");
      return;
    }

    scanBtn.disabled = true;
    scanBtn.textContent = 'Extracting Stylometrics...';
    resultBox.style.display = 'none';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || 'Analysis error. Minimum ~15 words required.');
        return;
      }

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
      alert('Could not connect to NotByHuman server (http://localhost:8000). Ensure python run.py is active.');
    } finally {
      scanBtn.disabled = false;
      scanBtn.textContent = 'Analyze Text';
    }
  });
});
