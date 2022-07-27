export const DEFAULT_MESSAGE = "Drink Water Right Now!";
export const DEFAULT_SHOW_PIN = true;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    reminder: DEFAULT_MESSAGE,
    showPin: DEFAULT_SHOW_PIN,
  });
});
