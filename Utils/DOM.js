export function qs(selector) {
  return document.querySelector(selector);
}

export function text(selector, text) {
  document.querySelector(selector).textContent = text;
}
