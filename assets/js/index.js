$(document).ready(function () {
  let products = [];

// Loading the initial JSON file only the first time
  $.getJSON("assets/server/data.json", function (data) {
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
        <div class="col-6 col-md-4 col-lg-3" id="product-${p.id}">
          <div class="card h-100 shadow-sm d-flex flex-column justify-content-between">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="card-body d-flex flex-column justify-content-between">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text">${p.type} - <strong>${p.price} sek</strong></p>
              <div>
                <button 
                class="btn btn-sm btn-outline-link text-danger delete-product" 
                data-id="${p.id}"
                >Delete</button>
              </div>
            </div>
          </div>
        </div>
      `);
    });
  }

  // ======== Search ===========
  $("#searchInput").on("keyup", function () {
    let term = $(this).val().toLowerCase();
    let filtered = products.filter((p) => p.name.toLowerCase().includes(term));
    renderProducts(filtered);
  });

  // ======== Filter By Price ===========
  $("#priceRange").on("input", function () {
    let maxPrice = $(this).val();
    $("#priceLabel").text(`Max Price : ${maxPrice} sek`);
    let filtered = products.filter((p) => p.price <= maxPrice);
    renderProducts(filtered);
  });

  // ======== Filter By Category ===========
  $("#typeFilter").on("change", function () {
    let type = $(this).val();
    let filtered = type ? products.filter((p) => p.type === type) : products;
    renderProducts(filtered);
  });

  // ======== Add New Product ===========

  $("#addProductBtn").click(function () {
    $("#productForm")[0].reset();
    $("#productId").val("");

    let modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
  });

  $("#productForm").submit(function (e) {
    e.preventDefault();

    let id = $("#productId").val();
    let name = $("#productName").val();
    let type = $("#productType").val();
    let price = parseFloat($("#productPrice").val());
    let image = $("#productImage").val() || "https://upload.wikimedia.org/wikipedia/commons/f/f5/No-Image-Placeholder-landscape.svg";

    if (!id) {
      let newId = products.length
        ? Math.max(...products.map((p) => p.id)) + 1
        : 1;
      products.push({ id: newId, name, type, price, image });
      $.toast({
        heading: 'success',
        text: 'Created New Product Successfully',
        icon: 'success',
        position: 'top-right'
      });
    }

    localStorage.setItem("products", JSON.stringify(products));
    renderProducts(products);

    let modalEl = document.getElementById("productModal");
    let modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

  });

  // ======== Delete Product ===========
  $(document).on("click", ".delete-product", function () {
    if (confirm("Are you sure you want to delete this product?")) {
      let id = $(this).data("id");
      products = products.filter((p) => p.id !== id);
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts(products);
      $.toast({
        heading: 'Deleted',
        text: 'Deleted Product Successfully',
        icon: 'error',
        position: 'top-right'
      });
    }
  });
})
