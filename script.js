let cart = [];
let totalPrice = 0;

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

window.onload = function () {
  if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    document.getElementById('dark-toggle').checked = true;
  }
};

// Slide in Cart feature
function toggleCart() {
  document.getElementById("cart-drawer").classList.toggle("open");
}

// Search bar
function filterProducts() {
  const query = document.getElementById("product-search").value.toLowerCase();
  document.querySelectorAll('.product').forEach(product => {
    product.style.display = product.textContent.toLowerCase().includes(query) ? "block" : "none";
  });
}

// Add item to cart
function addToCart(productName, price, quantity) {
  quantity = parseInt(quantity);
  cart.push({ name: productName, price: price, quantity: quantity });
  updateCart();
  showToast(`${productName} added to cart`);

  const activeButton = event.target;
  activeButton.classList.add("added");
  setTimeout(() => activeButton.classList.remove("added"), 300);
}

// ✅ Remove item from cart by index
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  showToast("Item removed from cart");
}

// ✅ Update cart display and count bubble
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalPriceElem = document.getElementById("total-price");
  const cartCountElem = document.getElementById("cart-count");

  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<li>No items in cart.</li>';
  } else {
    cart.forEach((item, index) => {
      const itemTotalPrice = (item.price * item.quantity).toFixed(2);
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} (x${item.quantity}) - $${itemTotalPrice}
        <button class="remove-btn" onclick="removeFromCart(${index})">🗑️</button>
      `;
      cartItems.appendChild(li);
    });
  }

  totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceElem.textContent = totalPrice.toFixed(2);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = totalItems;
}

// Toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.style.display = "none";
    }, 500);
  }, 2000);
}

// Scroll to cart section
function scrollToCart() {
  document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
}

// ✅ Checkout function (includes customer notes)
function checkout() {
  const customerName = document.getElementById("customer-name").value;
  const customerEmail = document.getElementById("customer-email").value;
  const customerAddress = document.getElementById("customer-address").value;
  const dropoffLocation = document.getElementById("dropoff-location").value;
  const customerPhone = document.getElementById("customer-phone").value;
  const customerNotes = document.getElementById("customer-notes").value;

  if (!customerName || !customerEmail || !customerAddress || !dropoffLocation || !customerPhone) {
    alert("Please fill out all the fields before checking out.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty. Please add some items before checking out.");
    return;
  }

  const orderDetails = cart.map(item => `${item.name} - $${item.price} x ${item.quantity}`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  emailjs.send("service_ynszdmf", "template_gaxjw0r", {
    customer_name: customerName,
    customer_email: customerEmail,
    customer_address: customerAddress,
    dropoff_location: dropoffLocation,
    customer_phone: customerPhone,
    customer_notes: customerNotes,
    order_details: orderDetails,
    total_price: total.toFixed(2)
  })
  .then((response) => {
    console.log("EmailJS SUCCESS:", response.status, response.text);

    const summaryText = `
Customer: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Address: ${customerAddress}
Drop-off Location: ${dropoffLocation}

Notes:
${customerNotes}

Order:
${orderDetails}

Total: $${total.toFixed(2)}
    `;
    localStorage.setItem("bradfields-order-summary", summaryText);

    cart = [];
    updateCart();
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = 1);
    document.getElementById("cart-drawer").classList.remove("open");

    window.location.href = "thankyou.html";
  })
  .catch((error) => {
    console.error("EmailJS FAILED:", JSON.stringify(error));
    alert("Failed to send order. Error: " + JSON.stringify(error));
  });
}

updateCart();
