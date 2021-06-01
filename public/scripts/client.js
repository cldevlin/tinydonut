$(document).ready(() => {

  const renderMenu = function() {
  const url = '/menu';
  $.ajax({url}).then((response) => {

  });
}


  $("#counter").submit(function(event) {
    event.preventDefault();
    $("#counter")
    //$("#cart-counter").val() += $(this).val();
    // check if order_exists
    // if does NOT -----> create new order
    // create new order_items table
    // update shopping cart counter
  });
});
