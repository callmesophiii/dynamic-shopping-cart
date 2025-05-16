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
let cartItems = {};

function updateTotal() {
  totalPrice = Object.values(cartItems).reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceSpan.textContent = totalPrice.toFixed(2);
}

function updateCartCount() {
  const count = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

function renderCart() {
  cart.innerHTML = '';

  Object.entries(cartItems).forEach(([name, item]) => {
    const li = document.createElement('li');
    li.className = 'cart-item';

    li.innerHTML = `
      <span>${name} - $${item.price.toFixed(2)} x ${item.quantity}</span>
      <div>
        <button class="decrease">−</button>
        <button class="increase">+</button>
        <button class="remove">Remove</button>
      </div>
    `;

    li.querySelector('.increase').onclick = () => {
      item.quantity++;
      updateCart();
    };

    li.querySelector('.decrease').onclick = () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        delete cartItems[name];
      }
      updateCart();
    };

    li.querySelector('.remove').onclick = () => {
      delete cartItems[name];
      updateCart();
    };

    cart.appendChild(li);
  });

  updateTotal();
  updateCartCount();
}

function updateCart() {
  renderCart();
  saveCart();
}

function addProduct() {
  const name = productNameInput.value.trim();
  const price = parseFloat(productPriceInput.value);

  if (!name || isNaN(price) || price <= 0) {
    alert('Please enter a valid product name and price.');
    return;
  }

  if (cartItems[name]) {
    cartItems[name].quantity++;
  } else {
    cartItems[name] = { price, quantity: 1 };
  }

  updateCart();

  productNameInput.value = '';
  productPriceInput.value = '';
}

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCart() {
  const saved = localStorage.getItem('cartItems');
  if (saved) {
    cartItems = JSON.parse(saved);
    updateCart();
  }
}

function showSaveFeedback() {
  saveCartIcon.classList.replace('bi-cart-check', 'bi-check-circle');
  setTimeout(() => {
    saveCartIcon.classList.replace('bi-check-circle', 'bi-cart-check');
  }, 1500);
}

function showError(message) {
  alert(message);
}

// Event Listeners
addProductButton.addEventListener('click', addProduct);
productPriceInput.addEventListener('keyup', e => e.key === 'Enter' && addProduct());
saveCartIcon.addEventListener('click', () => {
  saveCart();
  showSaveFeedback();
});

checkoutBtn.addEventListener('click', () => {
  if (Object.keys(cartItems).length === 0) {
    showError('Your cart is empty.');
    return;
  }
  paymentSection.style.display = 'block';
  checkoutBtn.style.display = 'none';
});

document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', e => {
    const method = e.target.value;
    creditForm.style.display = method === 'credit' ? 'block' : 'none';
    paypalForm.style.display = method === 'paypal' ? 'block' : 'none';
  });
});

confirmPaymentBtn.addEventListener('click', () => {
  const method = document.querySelector('input[name="payment"]:checked').value;

  if (method === 'credit') {
    const ccNum = document.getElementById('cc-number').value.trim();
    const expiry = document.getElementById('cc-expiry').value.trim();
    const cvv = document.getElementById('cc-cvv').value.trim();
    if (!ccNum || !expiry || !cvv) {
      return showError('Please fill out all credit card fields.');
    }
  }

  if (method === 'paypal') {
    const email = document.getElementById('paypal-email').value.trim();
    if (!email) {
      return showError('Please enter your PayPal email.');
    }
  }

  alert(`Payment confirmed using: ${method.toUpperCase()}`);

  cartItems = {};
  updateCart();

  paymentSection.style.display = 'none';
  checkoutBtn.style.display = 'inline-block';
});

// Initialize
loadCart();
