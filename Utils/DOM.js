export function qs(selector) {
  return document.querySelector(selector);
}

export function text(selector, text) {
  qs(selector).textContent = text;
}
