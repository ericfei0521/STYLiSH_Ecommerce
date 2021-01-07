// ESlint variable defined
/* global FB */
/* global apiPath */

const member = document.querySelectorAll(".userid");
let userAuth = "";

//========= FB SDK =========

window.fbAsyncInit = function () {
  FB.init({
    appId: "360258781840162",
    cookie: true,
    xfbml: true,
    version: "v8.0",
  });
  FB.AppEvents.logPageView();
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
};

const load = function () {
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
};
var userdata;
var memberDetail;
function statusChangeCallback(response) {
  if (response.status === "connected") {
    userAuth = response.authResponse;
    // console.log(userAuth.accessToken);
    let memberProvide = {
      provider: "facebook",
      access_token: userAuth.accessToken,
    };
    const url = apiPath + "/user/signin";
    let signinXhr = new XMLHttpRequest();
    signinXhr.open("POST", url, true);
    signinXhr.setRequestHeader("Content-type", "application/json");
    signinXhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        userdata = JSON.parse(signinXhr.response);
        memberDetail = userdata.data.user;
        // console.log(memberDetail);
        updateUserInfo(memberDetail);
      } else if (this.status == 404) {
        alert("not found");
      }
    };
    signinXhr.send(JSON.stringify(memberProvide));
  }
}
//========= FB Login Function =========
const login = function () {
  if (userAuth && window.location.href.includes("pages")) {
    window.location = "../pages/userprofile.html";
  } else if (userAuth && !window.location.href.includes("pages")) {
    window.location = "./pages/userprofile.html";
  } else if (userAuth && window.location.href.includes("userprofile")) {
    return;
  } else {
    FB.login(
      function (response) {
        if (response.status === "connected") {
          // Logged into your webpage and Facebook.
          if (window.location.href.includes("pages")) {
            window.location = "../pages/userprofile.html";
          } else if (!window.location.href.includes("pages")) {
            window.location = "./pages/userprofile.html";
          }
        } else {
          console.log("you have not logged in yet");
          // The person is not logged into your webpage or we are unable to tell.
        }
      },
      { scope: "public_profile,email" }
    );
  }
};
//========= User Profile Log-in info Render  =========
function updateUserInfo(response) {
  // console.log(response);
  if (window.location.href.includes("userprofile.html")) {
    let thankyou = document.querySelector(".thankyou");

    let userContainer = document.createElement("div");
    userContainer.className = "userContainer";

    let img = document.createElement("img");
    img.src = response.picture;
    img.alt = "FB profile image";
    userContainer.appendChild(img);

    let h3 = document.createElement("h3");
    h3.className = "userName";
    h3.textContent = response.name;
    userContainer.appendChild(h3);

    let userid = document.createElement("h4");
    userid.className = "userId";
    userid.textContent = "ID: " + response.id;
    userContainer.appendChild(userid);

    let userMail = document.createElement("h4");
    userMail.className = "userMail";
    userMail.textContent = "Mail: " + response.email;
    userContainer.appendChild(userMail);

    let logout = document.createElement("button");
    logout.className = "logout";
    logout.textContent = "登出";
    logout.onclick = function () {
      FB.logout();
      window.location = "../index.html";
    };
    userContainer.appendChild(logout);

    thankyou.appendChild(userContainer);
  }
}
for (let i = 0; i < member.length; i++) {
  member[i].addEventListener("click", login);
}

window.addEventListener("DOMContentLoaded", load);
