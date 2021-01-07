// ESlint variable defined
/* global TPDirect */
/* global cartIndex */
/* global totalPrice */
/* global apiPath */
/* global userAuth */
/* global cost*/
/* global confrimPay*/

//========= 全域宣告 =========

var receiptName = ElementPicker("#customerName");
var receiptEmail = ElementPicker("#customerEmail");
var receiptPhone = ElementPicker("#customerPhone");
var receiptAddress = ElementPicker("#customerAddress");
var receiptTime = document.getElementsByName("recipient-time");
var prime = "";
let time = "";

//========= 傳入API內容物格式空物件宣告 =========

let receiptInfo = {
  prime: "",
  order: {
    shipping: "delivery",
    payment: "credit_card",
    subtotal: "",
    freight: "60",
    total: "",
    recipient: {
      name: "",
      phone: "",
      email: "",
      address: "",
      time: "",
    },
    list: [],
  },
};

//========= TapPay SDK =========

TPDirect.setupSDK(
  12348,
  "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
  "sandbox"
);

TPDirect.card.setup({
  fields: {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "ccv",
    },
  },
  styles: {
    // Style all elements
    input: {
      color: "gray",
    },
    // Styling ccv field
    "input.ccv": {
      // 'font-size': '16px'
    },
    // Styling expiration-date field
    "input.expiration-date": {
      // 'font-size': '16px'
    },
    // Styling card-number field
    "input.card-number": {
      // 'font-size': '16px'
    },
    // style focus state
    ":focus": {
      // 'color': 'black'
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
});

TPDirect.card.onUpdate(function (update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    // submitButton.removeAttribute('disabled')
  } else {
    // Disable submit Button to get prime.
    // submitButton.setAttribute('disabled', true)
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
  if (update.cardType === "visa") {
    // Handle card type visa.
  }

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.number === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.expiry === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.expiry === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.ccv === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.ccv === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }
});

//========= Submit Form Function =========

function onSubmit(event) {
  //Regular expression Testing
  const emailRule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  const phoneRule = /^[09]{2}[0-9]{8}$/;
  for (let i = 0; i < receiptTime.length; i++) {
    if (receiptTime[i].checked) {
      time = receiptTime[i].value;
      //   console.log(time);
    }
  }
  //========= 使用者表單防呆 =========
  if (!receiptName.value) {
    alert("尚未填寫收件人姓名");
    return;
  } else if (!receiptEmail.value) {
    alert("尚未填寫收件人信箱");
    return;
  } else if (receiptEmail.value.search(emailRule) == -1) {
    receiptEmail.style.color = "red";
    receiptEmail.placeholder = "請填寫正確的EMAIL";
    alert("請填寫正確的EMAIL");
    return;
  } else if (!receiptPhone.value) {
    alert("尚未填寫收件人手機");
    return;
  } else if (receiptPhone.value.search(phoneRule) == -1) {
    receiptPhone.style.color = "red";
    receiptPhone.placeholder = "請填寫正確的手機號碼";
    alert("請填寫正確的手機號碼");
    return;
  } else if (!receiptAddress.value) {
    alert("尚未填寫收件人地址");
    return;
  }
  event.preventDefault();
  //========= 取得 TapPay Fields 的 status =========
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  let name = receiptName.value;
  let phone = receiptPhone.value;
  let email = receiptEmail.value;
  let address = receiptAddress.value;
  //========= 確認是否可以 getPrime =========
  if (tappayStatus.canGetPrime === false) {
    alert("信用卡資訊填寫錯誤");
    console.log("can not get prime");
    return;
  }
  //========= Get prime =========
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("傳送失敗");
      console.log("get prime error " + result.msg);
      return;
    }
    prime = result.card.prime;
    // =========  re assamble checkout information =========
    checkoutInfo(prime, name, email, phone, address, time);
    // ========= sending information to backend =========
    submitCheckout(receiptInfo);
  });
}

// ========= re assamble checkout information =========

function checkoutInfo(prime, name, email, phone, address, time) {
  // console.log(cartIndex);
  if (receiptInfo.order.list.length == 0) {
    for (let i = 0; i < cartIndex.length; i++) {
      let listItem = {
        id: "",
        name: "",
        price: "",
        color: {
          code: "",
          name: "",
        },
        size: "",
        qty: "",
      };
      listItem.id = cartIndex[i].id;
      listItem.name = cartIndex[i].name;
      listItem.price = cartIndex[i].price.substr(4);
      listItem.color.code = cartIndex[i].color;
      listItem.color.name = cartIndex[i].colorName;
      listItem.size = cartIndex[i].size;
      listItem.qty = cartIndex[i].number;
      receiptInfo.order.list.push(listItem);
    }
  }
  receiptInfo.prime = prime;
  receiptInfo.order.recipient.name = name;
  receiptInfo.order.recipient.email = email;
  receiptInfo.order.recipient.phone = phone;
  receiptInfo.order.recipient.address = address;
  receiptInfo.order.recipient.time = time;
  receiptInfo.order.subtotal = totalPrice.textContent;
  receiptInfo.order.total = cost.textContent;
  // console.log(receiptInfo);
}

// ========= connect checkout api to get checkout code =========

function submitCheckout(receiptInfo) {
  loading();
  const url = apiPath + "/order/checkout";
  let req = new XMLHttpRequest();
  req.open("POST", url, true);
  // console.log(receiptInfo);
  // console.log(userAuth.accessToken.length);
  req.setRequestHeader("Content-type", "application/json");
  if (userAuth) {
    req.setRequestHeader("Authorization", "Bearer" + userAuth.accessToken);
  }
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let code = JSON.parse(req.responseText).data.number;
      // console.log(code);
      localStorage.clear();
      window.location.href = `./thankyou.html?number=${code}`;
    } else if (this.status == 404) {
      alert("not found");
    }
  };
  req.send(JSON.stringify(receiptInfo));
}

// ========= waint connect page loading display =========

function loading() {
  document.querySelector(".showingLoading").style.display = "flex";
}

// ========= add checkout button enevtlistener =========
confrimPay.addEventListener("click", onSubmit);
