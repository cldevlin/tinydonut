const getPickupTime = function (timeEstimateInMinutes) {
  // const seconds = Math.floor( (total/1000) % 60 );
  // let pickupTime = new Date().getTime() + (timeEstimateInMinutes * 60 * 1000);
  console.log("timeEstimateInMinutes", timeEstimateInMinutes);
  let nowDate = Date.now();
  console.log("nowDate", nowDate, new Date(nowDate));
  let pikDate = nowDate + timeEstimateInMinutes * 60 * 1000;
  console.log("pikDate", pikDate, new Date(pikDate));
  let pickupTime = new Date(Date.now() + timeEstimateInMinutes * 60 * 1000);

  console.log("pickupTime", pickupTime);
  const minutes = timeEstimateInMinutes % 60;
  const hours = Math.floor(timeEstimateInMinutes / 60);
  console.log("-------------");
  console.log(pickupTime, minutes, hours);
  return {
    pickupTime,
    hours,
    minutes,
    seconds: 0,
  };
};

$(document).ready(() => {
  // Add to cart logic
  let addToCart = document.querySelectorAll(".card-footer > button");
  let cartCounter = document.querySelector("#cart-counter");

  const updateCart = function (donut) {
    axios.post("/menu", donut).then((res) => {
      cartCounter.innerText = res.data.totalQty;
      $("#clearCart").show();
      new Noty({
        theme: "nest",
        type: "success",
        text: "Donut added to cart 🍩",
        timeout: 1000,
        layout: "bottomRight",
        progressBar: false,
      }).show();
    });
  };

  addToCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let donut = JSON.parse(btn.dataset.donut);
      updateCart(donut);
    });
  });

  // Clear cart
  if (cartCounter.innerText == "") {
    $("#clearCart").hide();
  }

  const clearCart = function () {
    axios.post("/clearCart").then((res) => {
      cartCounter.innerText = "";
      $("#clearCart").hide();
      new Noty({
        theme: "nest",
        type: "success",
        text: "Cart emptied 🛒",
        timeout: 1000,
        layout: "bottomRight",
        progressBar: false,
      }).show();
    });
  };

  $("#clearCart").click(function () {
    clearCart();
  });

  if (document.querySelector("#waiting-time")) {
    if (!$(".waiting-time").innerText) {

      $(".time-ready").html("Waiting for restaurant response.")
    } else {
      let counter = document.querySelector("#waiting-time").innerHTML;
      // console.log("this is counter", counter);
      // const timeInfo = getPickupTime(counter);

      let i = counter * 60;

      const myInterval = setInterval(() => {

        console.log(i);
        if (i <= 0) {
          clearInterval(myInterval);
          $(".time-ready").html("");
          return;
        }
        let seconds = i % 60;
        let minutes;
        i > 59 ? (minutes = (i - seconds) / 60) : (minutes = 0);

        $(".time-ready").html("Ready in: " + minutes + ":" + String(seconds).padStart(2, "0"));
        i--;
      }, 1000);


    }
  }
});
