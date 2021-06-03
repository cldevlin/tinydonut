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



  let i = 30;
  let time = new Date().getTime() + i;
  console.log("this is time!!!!! -------", time);
  let hours = time.getHours();
  let minutes = time.getMinutes();

  $('.time-ready').html(hours + ':' + minutes);

  //fix this so that it doesn't reset if you refresh the page
  $('body').load(

    setInterval(function () {
      $("#timer").html(i);
      i--;
    }, 1000)

  );



});
