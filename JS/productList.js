// ESlint variable defined
/* global urlParams */
/* global apiPath */
/* global ajax */
/* global renderCart */

const detailView = document.querySelector(".detailView");
QuerStringData("id");

//========= for迴圈創建data內對應連結=============

function allRender(data) {
  if (!data) {
    detailView.innerHTML = `<h1> 沒有搜尋到任何產品哦 
    </h1>`;
  } else {
    productRender(data);
  }
}
var currentSelect = [];
//=============Product render function ====================

function productRender(data) {
  let productMainImg = document.createElement("div");
  productMainImg.className = "productMainImg";
  productMainImg.classList.add("productimg");

  let img = document.createElement("img");
  img.src = data.main_image;
  img.alt = "productImage";
  productMainImg.appendChild(img);

  let productDetail = document.createElement("div");
  productDetail.className = "productDetail";

  let productTitle = document.createElement("div");
  productTitle.className = "productTitle";

  let productName = document.createElement("h3");
  productName.id = "productName";
  productName.textContent = `${data.title}`;

  let productId = document.createElement("h4");
  productId.id = "productId";
  productId.textContent = `${data.id}`;

  productTitle.appendChild(productName);
  productTitle.appendChild(productId);
  productDetail.appendChild(productTitle);

  let productPrice = document.createElement("span");
  productPrice.id = "productPrice";
  productPrice.textContent = `TWD.${data.price}`;
  productDetail.appendChild(productPrice);

  let productColor = document.createElement("div");
  productColor.id = "productColor";

  let listTitle = document.createElement("div");
  listTitle.className = "listTitle";
  listTitle.textContent = "顏色";
  productColor.appendChild(listTitle);

  for (let i = 0; i < data.colors.length; i++) {
    let color = document.createElement("div");
    color.className = "color";
    color.tabIndex = 0;
    color.style.backgroundColor = "#" + data.colors[i].code;
    color.value = data.colors[i].code;
    color.name = data.colors[i].name;
    productColor.appendChild(color);

    // =============selecting color and checkcurrent variants================

    color.onclick = function checkCurrent() {
      currentSelect = [];
      value = 1;
      document.querySelector("#qtValue").textContent = value;
      for (let i = 0; i < data.variants.length; i++) {
        if (data.variants[i].color_code === this.value) {
          currentSelect.push(data.variants[i]);
        }
      }
      let colorall = document.querySelectorAll(".color");
      colorall.forEach((color) => {
        color.className = "color";
      });
      this.className = "color colorcurrent";

      let sizeall = document.querySelectorAll(".sizenone");
      sizeall.forEach((size) => {
        size.className = "sizenone";
      });
      for (let i = 0; i < currentSelect.length; i++) {
        if (
          sizeall[i].value === currentSelect[i].size &&
          currentSelect[i].stock !== 0
        ) {
          sizeall[i].className = "sizedisable sizenone";
          let sizefirst = document.querySelectorAll(".sizedisable");
          sizefirst[0].className = "sizenone sizedisable sizefocus";
        }
      }
      // console.log(currentSelect);
    };
  }

  productDetail.appendChild(productColor);

  // ===================  product size ====================

  let productSiz = document.createElement("div");
  productSiz.id = "productSiz";

  let listTitleSiz = document.createElement("div");
  listTitleSiz.className = "listTitle";
  listTitleSiz.textContent = "尺寸";
  productSiz.appendChild(listTitleSiz);

  for (let i = 0; i < data.sizes.length; i++) {
    let size = document.createElement("div");
    size.className = "sizenone";
    size.textContent = data.sizes[i];
    size.value = data.sizes[i];
    productSiz.appendChild(size);

    // =============depending on select color to show if size has stock or not ==============

    size.onclick = function () {
      value = 1;
      document.querySelector("#qtValue").textContent = value;
      let sizechange = document.querySelectorAll(".sizedisable");
      sizechange.forEach((size) => {
        size.className = "sizenone sizedisable";
      });
      for (let i = 0; i < currentSelect.length; i++) {
        if (
          this.value === currentSelect[i].size &&
          currentSelect[i].stock == 0
        ) {
          sizechange[0].className = "sizenone sizedisable sizefocus";
        } else if (
          this.value === currentSelect[i].size &&
          currentSelect[i].stock !== 0
        ) {
          this.className = "sizenone sizedisable sizefocus";
        }
      }
    };
  }

  productDetail.appendChild(productSiz);

  // =====================calculate product quantity=======================

  let productQt = document.createElement("div");
  productQt.id = "productQt";
  let qtListTitle = document.createElement("span");
  qtListTitle.textContent = "數量";
  qtListTitle.className = "listTitle";

  // ===========================calculator=============================

  let calcul = document.createElement("div");
  calcul.className = "calcul";
  let spanMinus = document.createElement("sapn");
  spanMinus.className = "op";
  spanMinus.textContent = "-";

  // ===============Minus 1 ============
  spanMinus.onclick = function () {
    if (value > 1) {
      value -= 1;
      // console.log(value);
      document.querySelector("#qtValue").textContent = value;
    }
  };

  // =============Product number display ================

  let stockNum = document.createElement("span");
  stockNum.id = "qtValue";
  stockNum.value = 1;
  var value = stockNum.value;
  stockNum.textContent = value;
  let spanPlus = document.createElement("span");

  // ====================nuber increase====================

  spanPlus.className = "op";
  spanPlus.textContent = "+";
  spanPlus.onclick = function () {
    let currentSize = document.querySelector(".sizefocus");
    let selectSize = currentSelect.filter(function (current) {
      return current.size === currentSize.value;
    });
    // console.log(selectSize[0].stock);
    if (value >= selectSize[0].stock) {
      return;
    } else {
      value += 1;
      document.querySelector("#qtValue").textContent = value;
    }
  };

  calcul.appendChild(spanMinus);
  calcul.appendChild(stockNum);
  calcul.appendChild(spanPlus);
  productQt.appendChild(qtListTitle);
  productQt.appendChild(calcul);
  productDetail.appendChild(productQt);

  let cartButton = document.createElement("button");
  cartButton.id = "add-cart";
  cartButton.textContent = "加入購物車";
  productDetail.appendChild(cartButton);

  let productSummary = document.createElement("div");
  productSummary.id = "product-summary";

  let summary = `<pre>
${data.note}
<br/>
${data.texture}
${data.description}
<br/>
清洗:${data.wash}
產地:${data.place}
<p>
`;
  productSummary.innerHTML = summary;
  productDetail.appendChild(productSummary);
  let descriptionInfo = document.createElement("div");

  let separator = document.createElement("div");
  separator.className = "sparator";
  let morinfo = document.createElement("span");
  morinfo.textContent = "更多產品資訊";
  let separateLine = document.createElement("div");
  separateLine.className = "line";

  separator.appendChild(morinfo);
  separator.appendChild(separateLine);

  descriptionInfo.className = "descriptionInfo";
  let productStory = document.createElement("div");
  productStory.id = "product-story";
  productStory.textContent = data.story;

  let productImg = document.createElement("div");
  productImg.className = "productimg";
  for (let i = 0; i < 2; i++) {
    let img = document.createElement("img");
    img.src = data.images[i];
    img.alt = "productImage";
    productImg.appendChild(img);
  }
  descriptionInfo.appendChild(productStory);
  descriptionInfo.appendChild(productImg);

  detailView.appendChild(productMainImg);
  detailView.appendChild(productDetail);
  detailView.appendChild(separator);
  detailView.appendChild(descriptionInfo);

  // =====================showing first select color and size when page loaded ====================

  let colorfirst = document.querySelectorAll(".color");
  colorfirst[0].className = "color colorcurrent";

  for (let i = 0; i < data.variants.length; i++) {
    if (data.variants[i].color_code === colorfirst[0].value) {
      currentSelect.push(data.variants[i]);
    }
  }
  let sizeall = document.querySelectorAll(".sizenone");
  for (let i = 0; i < currentSelect.length; i++) {
    if (
      sizeall[i].value === currentSelect[i].size &&
      currentSelect[i].stock !== 0
    ) {
      sizeall[i].className = "sizedisable sizenone";
      let sizefirst = document.querySelectorAll(".sizedisable");
      sizefirst[0].className = "sizenone sizedisable sizefocus";
    }
  }
  // console.log(currentSelect);
  const addButton = document.querySelector("#add-cart");
  addButton.addEventListener("click", addCart);
}

// -----------------cart function--------------------
function addCart() {
  let currentCart = {};
  let templist = JSON.parse(localStorage.getItem("cart"));

  // ------------------prevent console error------------------------
  if (templist === null) {
    templist = [];
  }
  // ------------------------------------------------------------------
  // --------adding current select max stock number -------------
  let currentSize = document.querySelector(".sizefocus");
  let selectSize = currentSelect.filter(function (current) {
    return current.size === currentSize.value;
  });
  // console.log(selectSize[0].stock);
  // ---------------------------------------------------------------

  let qtValue = document.querySelector("#qtValue").textContent;
  let cartSize = document.querySelector(".sizefocus").textContent;
  let cartColor = document.querySelector(".colorcurrent").value;
  let imgLink = document.querySelector(".productMainImg img").src;
  let colorName = document.querySelector(".colorcurrent").name;
  currentCart.name = document.querySelector("#productName").textContent;
  currentCart.id = document.querySelector("#productId").textContent;
  currentCart.price = document.querySelector("#productPrice").textContent;
  currentCart.number = qtValue;
  currentCart.size = cartSize;
  currentCart.color = cartColor;
  currentCart.stock = selectSize[0].stock;
  currentCart.image = imgLink;
  currentCart.colorName = colorName;

  let itemInclude = templist.find((item) => {
    return (
      item.id === currentCart.id &&
      item.color === currentCart.color &&
      item.size === currentCart.size
    );
  });
  if (itemInclude) {
    // console.log(itemInclude);
    itemInclude.number = qtValue;
  } else {
    templist.push(currentCart);
  }
  // console.log(templist);
  localStorage.setItem("cart", JSON.stringify(templist));
  alert(`已將商品${currentCart.name} 更改為數量${currentCart.number}`);
  renderCart();
}
//==================DOM Render=====================

function render() {
  ajax(apiPath + "/products/details?id=" + tag, "get", function (response) {
    allRender(response);
  });
}
window.addEventListener("DOMContentLoaded", render());
