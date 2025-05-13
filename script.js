const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const addProductButton = document.getElementById('add-product');
const cart = document.getElementById('cart');
const totalPriceSpan = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentSection = document.getElementById('payment-section');
const confirmPaymentBtn = document.getElementById('confirm-payment');
const creditForm = document.getElementById('credit-form');
const paypalForm = document.getElementById('paypal-form');
const saveCartIcon = document.getElementById('save-cart-icon');
const cartCount = document.getElementById('cart-count');

let totalPrice = 0;

// Update total price display
function updateTotalPrice(amount) {
  totalPrice += amount;
  totalPriceSpan.textContent = totalPrice.toFixed(2);
}

// Function to remove an item
function removeItem(event) {
  const item = event.target.closest('li');
  const price = parseFloat(item.dataset.price);
  updateTotalPrice(-price);
  item.remove();
  cartCount.textContent = Math.max(0, parseInt(cartCount.textContent) - 1);
}

// Add item
function addProduct() {
  const name = productNameInput.value.trim();
  const price = parseFloat(productPriceInput.value);
  cartCount.textContent = parseInt(cartCount.textContent) + 1;

  // Validate input
  if (!name || isNaN(price) || price <= 0) {
    alert("Please enter a valid product name and a price greater than 0.");
    return;
  }

  // Create cart item
  const listItem = document.createElement('li');
  listItem.className = 'cart-item';
  listItem.dataset.price = price;

  listItem.innerHTML = `
    <span>${name} - $${price.toFixed(2)}</span>
    <button>Remove</button>
  `;

  // Attach event
  listItem.querySelector('button').addEventListener('click', removeItem);

  // Add to cart
  cart.appendChild(listItem);

  // Total price
  updateTotalPrice(price);

  // Clear inputs
  productNameInput.value = '';
  productPriceInput.value = '';
}

// Add item on button click
addProductButton.addEventListener('click', addProduct);

// Show payment section on checkout
checkoutBtn.addEventListener('click', () => {
  if (cart.children.length === 0) {
    showError('Your cart is empty.');
    return;
  }
  paymentSection.style.display = 'block';
  checkoutBtn.style.display = 'none';
});

// Confirm payment selection
confirmPaymentBtn.addEventListener('click', () => {
  const method = document.querySelector('input[name="payment"]:checked').value;
  alert(`Payment confirmed using: ${method.toUpperCase()}`);

  // Clear cart & reset
  cart.innerHTML = '';
  total = 0;
  totalDisplay.textContent = '0.00';
  paymentSection.style.display = 'none';
  checkoutBtn.style.display = 'inline-block';
  saveCart();
});

// Listen for payment method change
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const method = e.target.value;
    creditForm.style.display = method === 'credit' ? 'block' : 'none';
    paypalForm.style.display = method === 'paypal' ? 'block' : 'none';
  });
});

// Confirm Payment Handler
confirmPaymentBtn.addEventListener('click', () => {
  const method = document.querySelector('input[name="payment"]:checked').value;

  // Validate mock form fields
  if (method === 'credit') {
    const ccNum = document.getElementById('cc-number').value.trim();
    const expiry = document.getElementById('cc-expiry').value.trim();
    const cvv = document.getElementById('cc-cvv').value.trim();
    if (!ccNum || !expiry || !cvv) {
      showError('Please fill out all credit card fields.');
      return;
    }
  }

  if (method === 'paypal') {
    const email = document.getElementById('paypal-email').value.trim();
    if (!email) {
      showError('Please enter your PayPal email.');
      return;
    }
  }

  alert(`Payment confirmed using: ${method.toUpperCase()}`);

  // Reset cart
  cart.innerHTML = '';
  total = 0;
  totalDisplay.textContent = '0.00';
  paymentSection.style.display = 'none';
  checkoutBtn.style.display = 'inline-block';
  saveCart();
});

// Save cart
saveCartIcon.addEventListener('click', () => {
  saveCart();
  showSaveFeedback();
});
function saveCart() {
  localStorage.setItem('cartHTML', cart.innerHTML);
  localStorage.setItem('total', total.toFixed(2));
}
function showSaveFeedback() {
  saveCartIcon.classList.remove('bi-cart-check');
  saveCartIcon.classList.add('bi-check-circle');

  setTimeout(() => {
    saveCartIcon.classList.remove('bi-check-circle');
    saveCartIcon.classList.add('bi-cart-check');
  }, 1500);
}

// Add product on Enter key press
productPriceInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    addProduct();
  }
});