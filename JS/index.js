//所有需要宣告
// ESlint variable defined
/* global urlParams */
/* global apiPath */
/* global ajax */

//========= 宣告一個空物件以便後續AJAX取得物件帶入 =========
var response = {};
//========= 產品列表呈現區域選取 =========
const productList = ElementPicker(".productlist");
// ========= 產品列表推波區域選取 =========
const keyVisualContainer = ElementPicker("#banner");
// ========= 推波產品相片選取 =========
const sliders = EelementAllPicker("campaignImg");
// ========= Slider控制器選取 =========
const circles = EelementAllPicker("circle");
// ========= URL QueryString 應用 =========
QuerStringData("tag");
//========= for迴圈創建data內對應連結 =========
function allRender(data) {
  if (data.length == 0) {
    productList.innerHTML = `<h1> 
    沒有搜尋到任何產品哦 </h1>`;
  } else {
    for (let i = 0; i < data.length; i++) {
      let productNum = data[i];
      let product = document.createElement("a");
      product.href = `./pages/product.html?id=${data[i].id}`;
      product.className = "product";
      productList.appendChild(product);
      productRender(productNum, product);
    }
  }
}

//========= Product render function =========

function productRender(num, container) {
  let img = document.createElement("img");
  img.src = num.main_image;
  img.alt = "cloth image";
  container.appendChild(img);
  let texture = document.createElement("div");
  texture.className = "texture";
  for (let i = 0; i < num.colors.length; i++) {
    let color = document.createElement("div");
    color.className = "color";
    color.style.backgroundColor = "#" + num.colors[i].code;
    texture.appendChild(color);
  }
  container.appendChild(texture);
  let productinfo = document.createElement("div");
  productinfo.className = "productinfo";

  let title = document.createElement("h3");
  title.className = "name";
  let t = document.createTextNode(num.title);
  title.appendChild(t);
  productinfo.appendChild(title);

  let price = document.createElement("h3");
  price.className = "price";
  let p = document.createTextNode("TWD ." + num.price);
  price.appendChild(p);
  productinfo.appendChild(price);

  container.appendChild(productinfo);
}

// ========= keyvisual function =========

ajax(apiPath + "/marketing/campaigns", "get", function (response) {
  keyVisulRender(response);
}); //使用AJAX 選取目前活動項目

// ========= 活動內容項目印製function =========
function keyVisulRender(data) {
  let circleContainer = document.createElement("div");
  circleContainer.className = "circleContainer";

  for (let i = 0; i < data.length; i++) {
    let circle = document.createElement("span");
    circle.className = "circle";
    circleContainer.appendChild(circle);
    keyVisualContainer.appendChild(circleContainer);
    circle.value = i;
    circle.onclick = function () {
      currentSlide(this.value);
    };
  }

  for (let i = 0; i < data.length; i++) {
    let backgroundImg = `url('${data[i].picture}')`;
    let marketCampaign = document.createElement("a");
    // console.log(backgroundImg);
    marketCampaign.className = "campaignImg";
    marketCampaign.href = `./pages/product.html?id=${data[i].product_id}`;

    let campainTex = document.createElement("div");
    campainTex.className = "story";
    campainTex.innerHTML = data[i].story.replace(/\r\n/g, "</br>");

    marketCampaign.style.backgroundImage = backgroundImg;
    marketCampaign.appendChild(campainTex);
    keyVisualContainer.appendChild(marketCampaign);
  }
  keyvisualDisplay();
}

//========= 設定起始張 =========
var myIndex = 1;
var myTimer;

function keyvisualDisplay() {
  carousel(myIndex);
  myTimer = setInterval(function () {
    plusSlides();
  }, 5000);

  keyVisualContainer.addEventListener("mouseenter", pause);
  keyVisualContainer.addEventListener("mouseleave", resume);
}

//========= background img play forword =========

function plusSlides() {
  carousel((myIndex += 1));
}

//========= click to show current img =========
function currentSlide(n) {
  clearInterval(myTimer);
  myTimer = setInterval(function () {
    plusSlides();
  }, 5000);
  carousel((myIndex = n + 1));
}

//========= carousel function =========
function carousel(n) {
  if (n > sliders.length) {
    myIndex = 1;
  }
  if (n < 1) {
    myIndex = sliders.length;
  }
  for (let i = 0; i < sliders.length; i++) {
    sliders[i].classList.remove("current");
  }
  for (let i = 0; i < circles.length; i++) {
    circles[i].className = circles[i].className.replace(" active", "");
  }
  sliders[myIndex - 1].classList.add("current");
  circles[myIndex - 1].className += " active";
}
//========= 暫停及繼續 =========
// 暫停
const pause = () => {
  clearInterval(myTimer);
};
//========= 繼續 =========
const resume = () => {
  clearInterval(myTimer);
  myTimer = setInterval(function () {
    plusSlides(myIndex);
  }, 5000);
};

// ========= infint scroll =========
window.addEventListener("scroll", function () {
  let rect = document.body.getBoundingClientRect();
  let scrollRenderHeight = Math.floor(rect.bottom - window.innerHeight);
  let page = response.next_paging;
  // console.log(scrollRenderHeight);
  if (scrollRenderHeight < 1 && scrollRenderHeight == 0) {
    if (page !== undefined && tag === null) {
      ajax(apiPath + "/products/" + "all" + "?paging=" + page, "get", function (
        response
      ) {
        allRender(response);
      });
    } else if (page !== undefined && tag !== null) {
      ajax(apiPath + "/products/" + tag + "?paging=" + page, "get", function (
        response
      ) {
        allRender(response);
      });
    }
  }
});

//========= NAV項目選取使用querySting重新導向讀取AJAX項目 =========

function render() {
  if (tag === null) {
    ajax(apiPath + "/products/" + "all", "get", function (response) {
      allRender(response);
    });
  } else if (tag === "women" || tag === "men" || tag === "accessories") {
    ajax(apiPath + "/products/" + tag, "get", function (response) {
      allRender(response);
    });
  } else {
    ajax(apiPath + "/products/" + "search?keyword=" + tag, "get", function (
      response
    ) {
      allRender(response);
    });
  }
}

//========= Window loading事件監聽 =========
window.addEventListener("DOMContentLoaded", render());
