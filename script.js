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
  const customerName = document.getElementById("customer-name").value;
  const customerEmail = document.getElementById("customer-email").value;

  if (!customerName || !customerEmail) {
    alert("Please enter your name and email before checking out.");
    return;
  }

  const orderDetails = cart.map(item => `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join(", ");
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Send email via EmailJS
  emailjs.send("service_cojca1l", "template_1ho3vzm", {
    customer_name: customerName,
    customer_email: customerEmail,
    order_details: orderDetails,
    total_price: totalPrice.toFixed(2)
  })
  .then((response) => {
    alert('Order placed successfully! A confirmation email will be sent.');
    console.log('SUCCESS!', response.status, response.text);
    cart = []; // Clear cart
    updateCart(); // Update cart display
  }, (error) => {
    alert('Failed to send order. Please try again.');
    console.log('FAILED...', error);
  });
}
