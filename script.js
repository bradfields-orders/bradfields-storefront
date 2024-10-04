let cart = [];
let totalPrice = 0;

// Function to add items to the cart
function addToCart(productName, price, quantity) {
  quantity = parseInt(quantity); // Ensure quantity is an integer
  cart.push({ name: productName, price: price, quantity: quantity });
  updateCart();
}

// Function to update the cart display
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalPriceElem = document.getElementById("total-price");
  cartItems.innerHTML = ''; // Clear previous items

  if (cart.length === 0) {
    cartItems.innerHTML = '<li>No items in cart.</li>';
  } else {
    cart.forEach((item, index) => {
      const itemTotalPrice = (item.price * item.quantity).toFixed(2);
      cartItems.innerHTML += `<li>${item.name} (x${item.quantity}) - $${itemTotalPrice}</li>`;
    });
  }

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceElem.textContent = totalPrice.toFixed(2);
}

function checkout() {
  // Get customer information
  const customerName = document.getElementById("customer-name").value;
  const customerEmail = document.getElementById("customer-email").value;
  const customerAddress = document.getElementById("customer-address").value;
  const dropoffLocation = document.getElementById("dropoff-location").value;
  const customerPhone = document.getElementById("customer-phone").value;

  // Check if required fields are filled
  if (!customerName || !customerEmail || !customerAddress || !dropoffLocation || !customerPhone) {
    alert("Please fill out all the fields before checking out.");
    return;
  }

  // Generate order details from cart
  const orderDetails = cart.map(item => `${item.name} - $${item.price} x ${item.quantity}`).join('\n');
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Check if cart is empty
  if (cart.length === 0) {
    alert('Your cart is empty. Please add some items before checking out.');
    return;
  }

  // Send email via EmailJS
  emailjs.send("service_ynszdmf", "template_gaxjw0r", {
    customer_name: customerName,
    customer_email: customerEmail,
    customer_address: customerAddress,
    dropoff_location: dropoffLocation,
    customer_phone: customerPhone,
    order_details: orderDetails,  // This is now properly defined
    total_price: totalPrice.toFixed(2)
  })
  .then((response) => {
    alert('Order placed successfully! A confirmation email will be sent.');
    console.log('SUCCESS!', response.status, response.text);
    
    // Clear cart and update display
    cart = [];
    updateCart();
  }, (error) => {
    alert('Failed to send order. Please try again.');
    console.log('FAILED...', error);
  });
}
