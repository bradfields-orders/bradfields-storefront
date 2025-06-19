let cart = [];
let totalPrice = 0;

// Add item to cart
function addToCart(productName, price, quantity) {
  quantity = parseInt(quantity); // Ensure quantity is an integer
  cart.push({ name: productName, price: price, quantity: quantity });
  updateCart();
  showToast(`${productName} added to cart`);
}

// Update cart display and cart count bubble
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalPriceElem = document.getElementById("total-price");
  const cartCountElem = document.getElementById("cart-count");
  cartItems.innerHTML = ''; // Clear previous items

  if (cart.length === 0) {
    cartItems.innerHTML = '<li>No items in cart.</li>';
  } else {
    cart.forEach((item) => {
      const itemTotalPrice = (item.price * item.quantity).toFixed(2);
      cartItems.innerHTML += `<li>${item.name} (x${item.quantity}) - $${itemTotalPrice}</li>`;
    });
  }

  // Update total price
  totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceElem.textContent = totalPrice.toFixed(2);

  // ✅ Update cart count bubble (outside loop)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = totalItems;
}

// Toast notification for visual feedback
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

// Smooth scroll to cart section
function scrollToCart() {
  document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
}

// Checkout function
function checkout() {
  const customerName = document.getElementById("customer-name").value;
  const customerEmail = document.getElementById("customer-email").value;
  const customerAddress = document.getElementById("customer-address").value;
  const dropoffLocation = document.getElementById("dropoff-location").value;
  const customerPhone = document.getElementById("customer-phone").value;

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
    order_details: orderDetails,
    total_price: total.toFixed(2)
  })
  .then((response) => {
    alert("Order placed successfully! Thank you for your order.");
    console.log("EmailJS SUCCESS:", response.status, response.text);
    
    // Reset everything
    cart = [];
    updateCart();
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = 1);
  })
  .catch((error) => {
    console.error("EmailJS FAILED:", JSON.stringify(error));
    alert("Failed to send order. Error: " + JSON.stringify(error));
  });
}
