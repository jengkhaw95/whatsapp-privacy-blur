console.log("In content script");

const contactNameSelector = `#pane-side [data-testid="cell-frame-title"]`;
const lastMessageSelector = `#pane-side [data-testid="last-msg-status"]`;
const activeChatContactNameToBlurSelector = `#pane-side div[aria-selected='true'][role='row'] [data-testid="cell-frame-title"]`;
const activeChatLastMessageToBlurSelector = `#pane-side div[aria-selected='true'][role='row'] [data-testid="last-msg-status"]`;
const chatContactNameToUnblurSelector = `#pane-side div:not([aria-selected='true'])[role='row'] [data-testid="cell-frame-title"]`;
const chatLastMessageToUnblurSelector = `#pane-side div:not([aria-selected='true'])[role='row'] [data-testid="last-msg-status"]`;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.enabled) {
    execution();
    // Listen for the keydown event on the document
    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("pointerdown", pointerdownHandler);
  } else {
    unblurBySelector([contactNameSelector, lastMessageSelector]);
    // Stop listening for the keydown event on the document
    document.removeEventListener("keydown", keydownHandler);
    document.addEventListener("pointerdown", pointerdownHandler);
  }
});

// Handle the keydown event
function keydownHandler(event) {
  if (event.key === "Escape") {
    // Change the style of the element
    setTimeout(() => {
      execution();
    }, 100);
  }
}
// Handle the pointerdown event
function pointerdownHandler() {
  setTimeout(() => {
    execution();
  }, 100);
}

function execution() {
  const isInActiveChat = document.querySelector("#main header");
  if (!isInActiveChat) {
    blurBySelector([contactNameSelector, lastMessageSelector]);
  } else {
    blurBySelector([
      chatContactNameToUnblurSelector,
      chatLastMessageToUnblurSelector,
    ]);
    unblurBySelector([
      activeChatContactNameToBlurSelector,
      activeChatLastMessageToBlurSelector,
    ]);
  }
}

function blurBySelector(selectors) {
  selectors.forEach((s) => {
    document.querySelectorAll(s).forEach((el) => {
      el.style.filter = "blur(5px)";
    });
  });
}

function unblurBySelector(selectors) {
  selectors.forEach((s) => {
    document.querySelectorAll(s).forEach((el) => {
      el.style.filter = "";
    });
  });
}

chrome.storage.sync.get("whatsapp-blur-enabled", function (data) {
  const isEnabled = data["whatsapp-blur-enabled"];
  if (isEnabled) {
    execution();
    // Listen for the keydown event on the document
    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("pointerdown", pointerdownHandler);
  } else {
    unblurBySelector([contactNameSelector, lastMessageSelector]);
    // Stop listening for the keydown event on the document
    document.removeEventListener("keydown", keydownHandler);
    document.addEventListener("pointerdown", pointerdownHandler);
  }
});
