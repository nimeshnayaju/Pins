import "./index.css";
import {
  computePosition,
  shift,
  flip,
  offset,
  autoUpdate,
} from "@floating-ui/dom";

const html = `
<div id="pinned-floating" />
`;

const doc = new DOMParser().parseFromString(html, "text/html");

if (doc.body.firstElementChild) {
  document.body.append(doc.body.firstElementChild);
}

const floating = document.getElementById("pinned-floating");

let showPin: boolean = true;

// retrieve the initial value of the reminder message
chrome.storage.sync.get(["reminder", "showPin"], (result) => {
  if (!floating) return;

  if (result.reminder) {
    floating.innerText = result.reminder;
  }

  showPin = result.showPin;
});

// listen for changes in the  value of the reminder message
chrome.storage.onChanged.addListener((changes, area) => {
  if (!floating) return;

  if (area === "sync") {
    if (changes.reminder && changes.reminder.newValue) {
      floating.innerText = changes.reminder.newValue;
    }
    if (changes.showPin) {
      showPin = changes.showPin.newValue;
    }
  }
});

let unsubAutoUpdate: () => void | undefined;

const onMouseMove = ({ clientX, clientY }: MouseEvent) => {
  if (!floating) return;

  if (unsubAutoUpdate) unsubAutoUpdate();

  if (!showPin) {
    hide();
    return;
  }

  const virtualEl = {
    getBoundingClientRect() {
      return {
        width: 0,
        height: 0,
        x: clientX,
        y: clientY,
        left: clientX,
        right: clientX,
        top: clientY,
        bottom: clientY,
      };
    },
  };

  unsubAutoUpdate = autoUpdate(virtualEl, floating, () => {
    computePosition(virtualEl, floating, {
      placement: "right-start",
      middleware: [offset(10), flip(), shift()],
    }).then(({ x, y }) => {
      Object.assign(floating.style, {
        top: `${y}px`,
        left: `${x}px`,
      });
    });
  });
};

document.addEventListener("mouseover", () => {
  if (!floating) return;

  document.addEventListener("mousemove", onMouseMove);
  show();
});

document.addEventListener("mouseleave", () => {
  if (!floating) return;

  if (unsubAutoUpdate) unsubAutoUpdate();

  document.removeEventListener("mousemove", onMouseMove);
  hide();
});

// document.onkeydown = (event: KeyboardEvent) => {
//   if (event.metaKey && event.key === "/") {
//   }
// };

const show = () => {
  if (!floating || !showPin) return;
  floating.style.opacity = "1";
  floating.style.transform = "scale(1)";
};

const hide = () => {
  if (!floating) return;
  floating.style.opacity = "0";
  floating.style.transform = "scale(0)";
};
