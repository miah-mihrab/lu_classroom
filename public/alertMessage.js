import "@babel/polyfill";

export const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, message) => {
  console.log("EH");
  const div = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", div);
  window.setTimeout(hideAlert, 5000);
};
