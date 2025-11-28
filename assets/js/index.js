$(document).ready(function () {
  let products = [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
    $("a[href='cart.html']").html(`Cart(${cart.length}<sub>item</sub>)`);
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
              <div class="d-flex justify-content-between">
                <button
                class="btn btn-sm btn-outline-link text-success add-to-cart"
                data-id="${p.id}"
                >Add</button>
                <button 
                class="btn btn-sm btn-outline-link text-primary edit-product"
                data-id="${p.id}"
                >Edit</button>
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

  // ======== Add to cart ===========
  $(document).on("click", ".add-to-cart", function () {
    let id = $(this).data("id");
    let product = products.find((p) => p.id === id);
    let existing = cart.find((p) => p.id === id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    $("a[href='cart.html']").html(`Cart(${cart.length}<sub>item</sub>)`);

    $.toast({
      heading: 'success',
      text: 'Product added to cart',
      icon: 'success',
      position: 'top-right'
    });
  });

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

    if (id) {
      // Product modification
      let index = products.findIndex((p) => p.id == id);
      products[index] = { id: parseInt(id), name, type, price, image };
      $.toast({
        heading: 'success',
        text: 'Modified Product Successfully',
        icon: 'success',
        position: 'top-right'
      });
    } else {
      // Add new product
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

  // ======== Edit Product ===========
  $(document).on("click", ".edit-product", function () {
    let id = $(this).data("id");
    let p = products.find((p) => p.id === id);

    $("#productId").val(p.id);
    $("#productName").val(p.name);
    $("#productType").val(p.type);
    $("#productPrice").val(p.price);
    $("#productImage").val(p.image);

    let modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
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
