$(document).ready(function () {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

renderCart();

  // ======== Render Cart ===========
  function renderCart() {
    $("#cartItems").empty();
    let total = 0;

    // Disable checkout button if cart is empty
    $("#checkoutBtn").prop("disabled", true);
    // Enable checkout button if cart has items
    if(cart.length !== 0) {
      $("#checkoutBtn").prop("disabled", false);
    }

    cart.forEach((item, i) => {
      let subtotal = item.price * item.qty;
      total += subtotal;
      $("#cartItems").append(`  
        <tr>
          <td>${item.name}</td>
          <td>$&nbsp;${item.price}</td>
          <td class="d-flex align-items-center no-wrap">
            <button class="btn btn-sm btn-outline-secondary decrement-qty" data-index="${i}">-</button>
            <span class="mx-2">${item.qty}</span>
            <button class="btn btn-sm btn-outline-secondary increment-qty" data-index="${i}">+</button>
          </td>
          <td>${subtotal}$</td>
          <td><button class="btn btn-danger btn-sm remove-item" data-index="${i}">Delete</button></td>
        </tr>
      `);
    });

    // Calculate total for all items
    total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    $("#totalPrice").text(total);
  }

  // ======== Remove item from cart ===========
  $(document).on('click', '.remove-item', function () {
    cart.splice($(this).data('index'), 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart()
    $.toast({
        heading: 'Deleted',
        text: 'Deleted Product From Cart',
        icon: 'error',
        position: 'top-right'
    });
  });

  // ======== Increment quantity ===========
  $(document).on('click', '.increment-qty', function () {
    let idx = $(this).data('index');
    console.log(cart[idx].qty)
    cart[idx].qty += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  });

  // ======== Decrement quantity ===========
  $(document).on('click', '.decrement-qty', function () {
    let idx = $(this).data('index');
    if (cart[idx].qty > 1) {
      cart[idx].qty -= 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  });

  // ======== Show Checkout modal ===========
  $("#checkoutBtn").click(function () {
    $("#checkoutModal").modal('show');
  });

  // ======== Confirm Checkout ===========
  $("#confirmCheckout").click(function () {
    localStorage.removeItem('cart');
    window.location.href = "index.html"; //redirect to home page
  });
})