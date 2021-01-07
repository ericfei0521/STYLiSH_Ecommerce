// ESlint variable defined
/* global renderCart */
/*global cartIndex:writable*/

//========= 購物車列表呈現區域選取 =========
const cartItemDispaly = ElementPicker(".cartList");
const totalPrice = ElementPicker("#total");
const cost = ElementPicker("#cost");
const itemNum = ElementPicker("#cartNum");
const confrimPay = document.getElementById("confirmPay");
//========= Cart Elements Render =========
function renderCartItem(data) {
  if (cartIndex && cartIndex.length !== 0) {
    itemNum.innerHTML = `購物車(${cartIndex.length})`;
    for (let i = 0; i < data.length; i++) {
      let productContainer = document.createElement("div");
      productContainer.className = "productContainer";

      let productInfo = document.createElement("div");
      productInfo.className = "productInfo";

      let productImg = document.createElement("img");
      productImg.className = "productImg";
      productImg.src = data[i].image;

      let productDetail = document.createElement("div");
      productDetail.className = "productDetail";

      let name = document.createElement("h3");
      name.textContent = data[i].name;

      let id = document.createElement("h3");
      id.textContent = data[i].id;

      let color = document.createElement("h3");
      color.textContent = `顏色 | ${data[i].colorName}`;

      let size = document.createElement("h3");
      size.textContent = `尺寸 | ${data[i].size}`;

      productDetail.appendChild(name);
      productDetail.appendChild(id);
      productDetail.appendChild(color);
      productDetail.appendChild(size);

      let checkOutDetail = document.createElement("div");
      checkOutDetail.className = "checkOutDetail";

      let numberSection = document.createElement("div");
      numberSection.className = "objSection";

      let selector = document.createElement("div");
      selector.className = "selector";

      let select = document.createElement("select");
      select.onchange = function () {
        select.name = i;
        data[i].number = this.value;
        localStorage.setItem("cart", JSON.stringify(data));
        //   console.log(this.name);
        //   console.log(this.value);
        let changeTotal = document.querySelectorAll(".subTotal");
        changeTotal[i].textContent = "NT. " + priceNumber * this.value;
        calculateTotal();
      };

      let stock = data[i].stock;
      let productNum = data[i].number;

      let numberTitle = document.createElement("div");
      numberTitle.textContent = "數量";
      numberTitle.className = "sectionTitle";
      numberSection.appendChild(numberTitle);

      for (let i = 0; i < stock; i++) {
        let option = document.createElement("option");
        option.textContent = i + 1;
        if (option.textContent === productNum) {
          option.selected = "selected";
        }
        select.appendChild(option);
      }
      selector.appendChild(select);
      numberSection.appendChild(selector);
      checkOutDetail.appendChild(numberSection);

      let priceSection = document.createElement("div");
      priceSection.className = "objSection";

      let priceTitle = document.createElement("h3");
      priceTitle.textContent = "單價";
      priceTitle.className = "sectionTitle";
      priceSection.appendChild(priceTitle);

      let price = document.createElement("h3");
      const chars = data[i].price.substr(4);
      let priceNumber = parseInt(chars);
      price.textContent = `NT. ${priceNumber}`;
      priceSection.appendChild(price);

      checkOutDetail.appendChild(priceSection);

      let subTotalSection = document.createElement("div");
      subTotalSection.className = "objSection";

      let subTotalTitle = document.createElement("h3");
      subTotalTitle.textContent = "小計";
      subTotalTitle.className = "sectionTitle";
      subTotalSection.appendChild(subTotalTitle);

      let subTotal = document.createElement("h3");
      subTotal.className = "subTotal";
      subTotal.textContent = "NT. " + priceNumber * productNum;
      subTotalSection.appendChild(subTotal);
      checkOutDetail.appendChild(subTotalSection);

      let trashCan = document.createElement("img");
      trashCan.src = "../src/img/cart-remove.png";
      trashCan.className = "clearproduct";
      checkOutDetail.appendChild(trashCan);

      productInfo.appendChild(productImg);
      productInfo.appendChild(productDetail);
      productContainer.appendChild(productInfo);
      productContainer.appendChild(checkOutDetail);
      cartItemDispaly.appendChild(productContainer);
    }
  } else {
    console.log(cartIndex);
    let noItem = document.createElement("h3");
    noItem.textContent = "購物車空空的耶";
    cartItemDispaly.appendChild(noItem);
    confrimPay.className = "disable";
  }
  removeRender();
  calculateTotal();
}

window.addEventListener("DOMContentLoaded", renderCartItem(cartIndex));

//========= Remove Elements Function =========

function removeRender() {
  let lists = document.querySelectorAll(".clearproduct");
  console.log(cartIndex);
  lists.forEach((list, index) => {
    list.onclick = () => {
      console.log(index);
      alert(
        `您已刪除物件${cartIndex[index].name} 顏色:${cartIndex[index].colorName} 尺寸:${cartIndex[index].size}`
      );
      cartIndex.splice(index, 1);
      console.log(cartIndex);
      localStorage.setItem("cart", JSON.stringify(cartIndex));

      cartIndex = JSON.parse(localStorage.getItem("cart"));
      // console.log(cartIndex);
      Array.from(document.querySelectorAll(".productContainer")).forEach((p) =>
        p.remove()
      );
      renderCartItem(cartIndex);
      calculateTotal();
      renderCart();
    };
  });
}

//========= Calculate TotalCaculate Function =========

function calculateTotal() {
  let productTotal = document.querySelectorAll(".subTotal");
  let currentd = 0;
  for (let i = 0; i < productTotal.length; i++) {
    currentd += parseInt(productTotal[i].textContent.substr(3));
  }
  // console.log(currentd);
  totalPrice.innerHTML = currentd;
  cost.innerHTML = currentd + 60;
}
