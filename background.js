// Store the H1 counts for each tab
const h1Counts = {};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'h1Count' && sender.tab) {
    // Store the count for the specific tab ID
    h1Counts[sender.tab.id] = message.count;
  }
});

// Handle popup requests for the H1 count
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getH1Count' && message.tabId) {
    // Send the H1 count for the requested tab ID
    sendResponse({ count: h1Counts[message.tabId] || 0 });
  }
});