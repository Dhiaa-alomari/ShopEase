$(document).ready(function () {
  let products = [];

// Loading the initial JSON file only the first time
  $.getJSON("../../data.json", function (data) {
    if (!localStorage.getItem("products")) {
      localStorage.setItem("products", JSON.stringify(data.products));
    }
    products = JSON.parse(localStorage.getItem("products"));
    renderProducts(products);
  });

// ======== Products Display Function ===========
  function renderProducts(items) {
    $("#productsContainer").empty();
    if (items.length === 0) {
      $("#productsContainer").html(
        `<p class="text-center text-muted"> No products found </p>`
      );
      return;
    }

    items.forEach(function (p) {
      $("#productsContainer").append(`
        <div class="col-sm-6 col-md-4 col-lg-3" id="product-${p.id}">
          <div class="card h-100 shadow-sm d-flex flex-column justify-content-between">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="card-body d-flex flex-column justify-content-between">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text">${p.type} - <strong>${p.price} sek</strong></p>
            </div>
          </div>
        </div>
      `);
    });
  }
})
