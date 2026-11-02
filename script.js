const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();


// Lightweight enquiry cart. Cart contents are kept in this browser only.
const cart = [];
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const checkoutForm = document.getElementById('checkoutForm');
const waNumber = '919380431760';
function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = total;
  if (!cart.length) {
    cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is waiting for a few wedding details. Add products to get started.</p>';
    return;
  }
  cartItemsEl.innerHTML = cart.map((item, i) => `<div class="cart-line"><div><strong>${item.name}</strong><small>Price confirmed by Chers</small></div><div class="qty-control"><button type="button" data-action="minus" data-index="${i}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-action="plus" data-index="${i}" aria-label="Increase quantity">+</button><button type="button" class="remove-item" data-action="remove" data-index="${i}">Remove</button></div></div>`).join('');
}
function showCart() { cartOverlay.classList.add('visible'); cartOverlay.setAttribute('aria-hidden','false'); document.body.classList.add('cart-open'); }
function hideCart() { cartOverlay.classList.remove('visible'); cartOverlay.setAttribute('aria-hidden','true'); document.body.classList.remove('cart-open'); }
openCartBtn?.addEventListener('click', showCart);
closeCartBtn?.addEventListener('click', hideCart);
cartOverlay?.addEventListener('click', e => { if (e.target === cartOverlay) hideCart(); });
document.querySelectorAll('.add-cart').forEach(btn => btn.addEventListener('click', () => {
  const name = btn.dataset.product; const existing = cart.find(item => item.name === name);
  if (existing) existing.qty += 1; else cart.push({name, qty:1});
  renderCart(); btn.textContent = 'Added ✓'; setTimeout(() => btn.textContent = 'Add to cart +', 1200);
}));
cartItemsEl?.addEventListener('click', e => {
  const btn = e.target.closest('button[data-action]'); if (!btn) return;
  const i = Number(btn.dataset.index); const action = btn.dataset.action;
  if (action === 'plus') cart[i].qty += 1;
  if (action === 'minus') cart[i].qty = Math.max(1, cart[i].qty - 1);
  if (action === 'remove') cart.splice(i,1); renderCart();
});
checkoutForm?.addEventListener('submit', e => {
  e.preventDefault(); if (!cart.length) { alert('Please add at least one item to your cart.'); return; }
  const data = new FormData(checkoutForm);
  const lines = cart.map(item => `• ${item.name} — Qty: ${item.qty}`).join('\n');
  const message = `Hi Chers! I would like to enquire about these items:\n\n${lines}\n\nDelivery location: ${data.get('location')}\nWedding date: ${data.get('weddingDate')}\nTheme / colour palette: ${data.get('theme')}\nAdditional notes: ${data.get('notes') || 'None'}\n\nPlease share availability, pricing and delivery details.`;
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
renderCart();
