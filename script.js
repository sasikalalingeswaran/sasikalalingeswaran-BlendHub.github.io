

var products = [
  {
    id: 'earbuds',
    name: 'Pulse Earbuds Pro',
    price: '$54.00',
    category: 'electronics',
    categoryLabel: 'Electronics',
    desc: 'Wireless earbuds with noise cancellation and 24-hour battery life.',
    details: ['Bluetooth 5.3 connectivity', 'Sweat and splash resistant', 'Includes charging case'],
    image: 'images/pulse-earbuds-pro.jpg'
  },
  {
    id: 'jacket',
    name: 'Voyager Bomber Jacket',
    price: '$89.00',
    category: 'clothing',
    categoryLabel: 'Clothing',
    desc: 'Lightweight bomber jacket built for everyday layering.',
    details: ['Water-resistant outer shell', 'Available in 4 colors', 'Machine washable'],
    image: 'images/voyager-bomber-jacket.jpg'
  },
  {
    id: 'wallet',
    name: 'Orbit Slim Wallet',
    price: '$24.00',
    category: 'accessories',
    categoryLabel: 'Accessories',
    desc: 'Slim leather wallet with RFID-blocking card slots.',
    details: ['Holds up to 8 cards', 'Genuine leather', 'Slim profile, fits front pocket'],
    image: 'images/orbit-slim-wallet.webp'
  },
  {
    id: 'speaker',
    name: 'Nimbus Mini Speaker',
    price: '$36.00',
    category: 'electronics',
    categoryLabel: 'Electronics',
    desc: 'Compact bluetooth speaker with surprisingly big sound.',
    details: ['10-hour playtime', 'Built-in microphone', 'Weighs just 210g'],
    image: 'images/Nimbus Mini Speaker.webp'
  },
  {
    id: 'tee',
    name: 'Drift Graphic Tee',
    price: '$19.00',
    category: 'clothing',
    categoryLabel: 'Clothing',
    desc: 'Soft cotton t-shirt with an original front print.',
    details: ['100% organic cotton', 'Unisex fit', 'Pre-shrunk fabric'],
    image: 'images/drift-graphic-tee.jpg'
  },
  {
    id: 'watch',
    name: 'Halo Steel Watch',
    price: '$65.00',
    category: 'accessories',
    categoryLabel: 'Accessories',
    desc: 'Minimalist stainless steel watch with a leather strap.',
    details: ['Water resistant to 30m', 'Interchangeable strap', '2-year warranty'],
    image: 'images/halo-steel-watch.jpg'
  }
];



document.addEventListener('DOMContentLoaded', function () {

  var grid = document.getElementById('productsGrid');
  var cartCountEl = document.getElementById('cart-count');
  var cartButton = document.getElementById('cartButton');
  var categoryButtons = document.querySelectorAll('.category-btn');

  var detailOverlay = document.getElementById('detailOverlay');
  var detailClose = document.getElementById('detailClose');
  var detailImage = document.getElementById('detailImage');
  var detailCategory = document.getElementById('detailCategory');
  var detailName = document.getElementById('detailName');
  var detailPrice = document.getElementById('detailPrice');
  var detailDesc = document.getElementById('detailDesc');
  var detailAddBtn = document.getElementById('detailAddBtn');

  var cartCount = 0;
  var currentCategory = 'all';
  var selectedProduct = null;

  
  function createCardHTML(product) {
    return (
      '<article class="product-card" data-id="' + product.id + '">' +
        '<div class="product-image">' +
          '<span class="category-label category-' + product.category + '">' + product.categoryLabel + '</span>' +
          '<button class="wishlist-btn" data-action="wishlist" type="button" aria-label="Save ' + product.name + '">&#9825;</button>' +
          '<img src="' + product.image + '" alt="' + product.name + '">' +
        '</div>' +
        '<h3 class="product-name">' + product.name + '</h3>' +
        '<p class="product-desc">' + product.desc + '</p>' +
        '<p class="product-price">' + product.price + '</p>' +
        '<div class="card-buttons">' +
          '<button class="view-details-btn" data-action="view" type="button">View Details</button>' +
          '<button class="add-to-cart-btn" data-action="add" type="button">Add to Cart</button>' +
        '</div>' +
      '</article>'
    );
  }


  function renderProducts(category) {
    var list = category === 'all'
      ? products
      : products.filter(function (p) { return p.category === category; });

    grid.innerHTML = list.map(createCardHTML).join('');
  }
  function showCategory(category, button) {
    if (category === currentCategory) return;
    currentCategory = category;

    categoryButtons.forEach(function (btn) { btn.classList.remove('active'); });
    button.classList.add('active');

    grid.classList.remove('slide-in');
    grid.classList.add('slide-out');

    setTimeout(function () {
      renderProducts(category);
      grid.classList.remove('slide-out');
      void grid.offsetWidth; 
      grid.classList.add('slide-in');
    }, 300);
  }

  categoryButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      showCategory(button.getAttribute('data-category'), button);
    });
  });

  // ---- Cart helpers ----
  function bumpCart() {
    cartCount++;
    cartCountEl.textContent = cartCount;

    cartButton.classList.remove('pop');
    void cartButton.offsetWidth;
    cartButton.classList.add('pop');
  }

  function flashAdded(button) {
    var originalText = button.textContent;
    button.classList.add('added');
    button.textContent = 'Added \u2713';

    setTimeout(function () {
      button.classList.remove('added');
      button.textContent = originalText;
    }, 1200);
  }

  // ---- Product detail drawer ----
  function openDetails(product) {
    selectedProduct = product;

    detailImage.src = product.image;
    detailImage.alt = product.name;
    detailCategory.textContent = product.categoryLabel;
    detailName.textContent = product.name;
    detailPrice.textContent = product.price;
    detailDesc.textContent = product.desc;

    detailOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDetails() {
    detailOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  detailClose.addEventListener('click', closeDetails);

  detailOverlay.addEventListener('click', function (event) {
    if (event.target === detailOverlay) closeDetails();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeDetails();
  });

  detailAddBtn.addEventListener('click', function () {
    if (!selectedProduct) return;
    bumpCart();
    flashAdded(detailAddBtn);
  });

  // ---- Event delegation for card buttons (wishlist / view / add) ----
  grid.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-action]');
    if (!button) return;

    var card = button.closest('.product-card');
    var product = products.filter(function (p) { return p.id === card.getAttribute('data-id'); })[0];
    var action = button.getAttribute('data-action');

    if (action === 'wishlist') {
      button.classList.toggle('liked');
      button.innerHTML = button.classList.contains('liked') ? '&#9829;' : '&#9825;';
    } else if (action === 'view') {
      openDetails(product);
    } else if (action === 'add') {
      bumpCart();
      flashAdded(button);
    }
  });

  // ---- Initial render ----
  renderProducts('all');

  // ---- Contact form submission (UI only, no backend) ----
  var contactForm = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();

    if (name && email && message) {
      formStatus.classList.remove('hidden');
      contactForm.reset();

      setTimeout(function () {
        formStatus.classList.add('hidden');
      }, 4000);
    }
  });

  // ---- Nav link active state ----
  var navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  // ---- Dark mode toggle (header checkbox switch + mobile icon button) ----
  var themeToggle = document.getElementById('themeToggle');
  var mobThemeToggle = document.getElementById('mobThemeToggle');

  function isDarkMode() {
    return document.documentElement.classList.contains('dark-mode');
  }

  function updateThemeIcons() {
    var dark = isDarkMode();
    if (themeToggle) themeToggle.checked = dark;
    if (mobThemeToggle) {
      mobThemeToggle.querySelector('i').className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  function setDarkMode(dark) {
    document.documentElement.classList.toggle('dark-mode', dark);
    localStorage.setItem('blendhub-theme', dark ? 'dark' : 'light');
    updateThemeIcons();
  }

  updateThemeIcons(); // match whatever the inline head script already applied

  if (themeToggle) {
    themeToggle.addEventListener('change', function () {
      setDarkMode(themeToggle.checked);
    });
  }

  if (mobThemeToggle) {
    mobThemeToggle.addEventListener('click', function () {
      setDarkMode(!isDarkMode());
    });
  }

  // ---- Shop Now button on hero (scrolls to products) ----
  var shopBtn = document.querySelector('.shop');
  if (shopBtn) {
    shopBtn.addEventListener('click', function () {
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---- Hero slideshow ----
  showSlides();
});


var slideIndex = 0;
var slideTimer;

function showSlides() {
  var i;
  var slides = document.getElementsByClassName('mySlides');
  var dots = document.getElementsByClassName('dot');

  if (slides.length === 0) return;

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }

  slides[slideIndex - 1].style.display = 'flex';
  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].classList.add('active');
  }

  clearTimeout(slideTimer);
  slideTimer = setTimeout(showSlides, 3000);
}

function currentSlide(n) {
  clearTimeout(slideTimer);
  slideIndex = n - 1;
  showSlides();
}

 if (localStorage.getItem('blendhub-theme') === 'dark') {
    document.documentElement.classList.add('dark-mode');
  }
