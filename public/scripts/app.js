const getPickupTime = function (timeEstimateInMinutes) {
  // const seconds = Math.floor( (total/1000) % 60 );
  // let pickupTime = new Date().getTime() + (timeEstimateInMinutes * 60 * 1000);
  console.log("timeEstimateInMinutes", timeEstimateInMinutes);
  let nowDate = Date.now();
  console.log("nowDate", nowDate, new Date(nowDate));
  let pikDate = nowDate + (timeEstimateInMinutes * 60 * 1000);
  console.log("pikDate", pikDate, new Date(pikDate));
  let pickupTime = new Date(Date.now() + (timeEstimateInMinutes * 60 * 1000));


  console.log("pickupTime", pickupTime);
  const minutes = timeEstimateInMinutes % 60;
  const hours = Math.floor(timeEstimateInMinutes / 60);
  console.log("-------------");
  console.log(pickupTime, minutes, hours);
  return {
    pickupTime,
    hours,
    minutes,
    seconds: 0
  }
};


$(document).ready(() => {
  // Add to cart logic
  let addToCart = document.querySelectorAll(".card-footer > button");
  let cartCounter = document.querySelector("#cart-counter");
  const updateCart = function (donut) {
    axios.post("/menu", donut).then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        theme: "nest",
        type: "success",
        text: "Donut added to cart",
        timeout: 1000,
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
  // **************************************************************************************************


  // const deadline = 'June 3 2021 23:59:59 GMT+0200';
  // let i = 30;
  //fix this so that it doesn't reset if you refresh the page
  $('body').ready(() => {

    // console.log("-------LINE 46------");
    let counter = document.querySelector(".waiting-time").innerText;
    console.log("this is counter", counter);
    const timeInfo = getPickupTime(counter);
    // console.log("this is time!!!!! -------", timeInfo);
    // let hours = timeInfo.pickupTime.getHours();
    // let minutes = timeInfo.pickupTime.getMinutes();
    // console.log("hours, minutes", hours, minutes);

    // $('.time-ready').html(String(hours).prototype.padStart(2, '0') + ':' + String(minutes).prototype.padStart(2, '0'));

    let i = counter * 60;
    // let i = 5;



    const myInterval = setInterval(() => {
      console.log(i);
      if (i <= 0) {
        clearInterval(myInterval);
        $(".time-ready").html('00:00')
        return;
      }
      let seconds = i % 60;
      let minutes;
      i > 59 ? minutes = (i - seconds) / 60 : minutes = 0;

      // console.log("minutes", minutes, "seconds", seconds);

      $(".time-ready").html(minutes + ':' + String(seconds).padStart(2, '0'));
      i--;
    }, 1000)
  });



});

