// Get the checkbox element
const checkbox = document.getElementById("toggle");

chrome.storage.sync.get("whatsapp-blur-enabled", function (data) {
  checkbox.checked = data["whatsapp-blur-enabled"];

  // Send a message to the content script to enable or disable the extension
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {enabled: checkbox.checked});
  });
});

// Listen for changes to the checkbox
checkbox.addEventListener("change", function (e) {
  chrome.storage.sync.set({"whatsapp-blur-enabled": e.target.checked});

  // Get the current tab
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    // Send a message to the content script to enable or disable the extension
    chrome.tabs.sendMessage(tabs[0].id, {enabled: e.target.checked});
  });
});
