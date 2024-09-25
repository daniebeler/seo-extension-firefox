// Get the active tab and execute a script to retrieve the visible H1 count
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const tabId = tabs[0].id; // Get the current tab ID

  chrome.scripting.executeScript(
      {
          target: { tabId: tabId },
          func: () => {
              // Return the stored H1 count from the content script
              return window.visibleH1TagCount || 0; 
          }
      },
      (results) => {
          // Log the results for debugging purposes
          console.log('Results from content script:', results);

          if (chrome.runtime.lastError) {
              console.error('Script execution failed:', chrome.runtime.lastError);
              document.getElementById('h1-count').textContent = 'Error retrieving count';
              return;
          }

          // Display the H1 count in the popup
          if (results && results[0]) {
              document.getElementById('h1-count').textContent = results[0].result;
          } else {
              document.getElementById('h1-count').textContent = '0';
          }
      }
  );
});