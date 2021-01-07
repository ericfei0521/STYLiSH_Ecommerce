//所有需要宣告
// ESlint variable defined

/*global response:writable*/

/*eslint no-unused-vars: ["error", { "vars": "local" }]*/

var apiPath = "https://api.appworks-school.tw/api/1.0";
var tag;
const loadPage = document.querySelector(".loadingPage");

//-------------- URL QueryString function --------------
const QuerStringData = function (obj) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  tag = urlParams.get(obj);
};
//-------------- Specific Element getting Funciton --------------
const ElementPicker = function (select) {
  return document.querySelector(select);
};
//-------------- All Element getting Funciton --------------
const EelementAllPicker = function (select) {
  return document.getElementsByClassName(select);
};
//-------------- AJAX  function --------------
const ajax = function (src, method, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      response = JSON.parse(xhr.responseText);
      let data = response.data;
      setTimeout((loadPage.style.display = "none"), 5000);
      callback(data);
    } else if (this.status == 404) {
      alert("not found");
    }
  };
  xhr.open(method, src);
  xhr.send();
};

// -------------- Cart Number render --------------
let cartIndex;
let cartNum;
function renderCart() {
  if (localStorage.getItem("cart") !== null) {
    cartIndex = JSON.parse(localStorage.getItem("cart"));
    cartNum = String(cartIndex.length);
    // console.log(cartQt);
    let x = document.getElementsByClassName("cart-qt");
    // console.log(x.length);
    for (let i = 0; i < x.length; i++) {
      x[i].innerHTML = cartNum;
    }
  } else {
    return;
  }
}
renderCart();
