$(document).ready(() => {
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
});
