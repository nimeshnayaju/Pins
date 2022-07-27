import "./index.css";

const message = document.getElementById("message") as HTMLInputElement;

const showPin = document.getElementById("pin") as HTMLInputElement;

chrome.storage.sync.get(["reminder", "showPin"], (result) => {
  if (!message || !showPin) return;

  if (result.reminder) {
    message.value = result.reminder;
  }
  if (result.showPin) {
    showPin.checked = result.showPin;
  }
});

message?.addEventListener(
  "input",
  debounce((event) => {
    chrome.storage.sync.set({
      reminder: (event.target as HTMLInputElement).value,
    });
  }, 200)
);

showPin?.addEventListener("change", (event) => {
  chrome.storage.sync.set({
    showPin: (event.currentTarget as HTMLInputElement).checked,
  });
});

function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number
) {
  let timer: number;

  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}
