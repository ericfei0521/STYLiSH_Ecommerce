// ESlint variable defined
/* global urlParams */

const tag = urlParams.get("number");
console.log(tag);

let code = document.querySelector("#shopCode");

function loadingDisplay() {
  code.textContent = tag;
}
window.addEventListener("DOMContentLoaded", loadingDisplay());
