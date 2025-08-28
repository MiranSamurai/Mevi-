let cart = [];
let cartCount = 0;
let cartTotal = 0;

function addToCart(name, price, emoji) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            emoji: emoji,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    
    // Show feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.background = '#4caf50';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }, 1000);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    document.getElementById('cartCount').textContent = cartCount;
    const cartCountMobile = document.getElementById('cartCountMobile');
    if (cartCountMobile) cartCountMobile.textContent = cartCount;
    const cartCountMobileHeader = document.getElementById('cartCountMobileHeader');
    if (cartCountMobileHeader) cartCountMobileHeader.textContent = cartCount;
    document.getElementById('cartTotal').textContent = `Total: ${cartTotal.toFixed(0)} IQD`;
    
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
    } else {
        let cartHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.emoji} ${item.name}</h4>
                    <p>${item.price.toFixed(0)} IQD each</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span class="cart-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            </div>
        `).join('');
        
        // Add minimum order message if needed
        if (cartCount < 4) {
            cartHTML += `
                <div class="minimum-order-message">
                    <p>⚠️ Minimum order: 4 items</p>
                    <p>Add ${4 - cartCount} more item(s) to checkout</p>
                </div>
            `;
        }
        
        cartItems.innerHTML = cartHTML;
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (sidebar.classList.contains('open')) {
        closeCart();
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('open');
    }
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
}

function checkout() {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cart Empty!',
            text: 'Your cart is empty. Please add some delicious ice pops first!',
            confirmButtonColor: '#667eea',
            background: '#fff',
            color: '#333'
        });
        return;
    }
    
    // Check minimum order quantity
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (totalItems < 4) {
        Swal.fire({
            icon: 'info',
            title: 'Minimum Order Required',
            html: `
                <p>Minimum order is <strong>4 items</strong></p>
                <p>You currently have <strong>${totalItems} item(s)</strong></p>
                <p>Please add <strong>${4 - totalItems} more item(s)</strong> to proceed</p>
            `,
            confirmButtonText: 'Add More Items',
            confirmButtonColor: '#667eea',
            background: '#fff',
            color: '#333'
        });
        return;
    }
    
    // Create WhatsApp message
    const restaurantNumber = '9647511762295'; // Your WhatsApp number (Iraq country code + your number)
    
    let message = `🍦 *New Order from Mevi Website* 🍦\n\n`;
    message += `📋 *Order Details:*\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.emoji} ${item.name}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: ${item.quantity} × ${item.price} IQD = ${(item.quantity * item.price)} IQD\n\n`;
    });
    
    message += `💰 *Total Amount: ${cartTotal.toFixed(0)} IQD*\n\n`;
    message += `📞 Please confirm this order and let me know the delivery details.\n\n`;
    message += `Thank you! 😊`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${restaurantNumber}?text=${encodedMessage}`;
    
    // Show success message before opening WhatsApp
    Swal.fire({
        icon: 'success',
        title: 'Order Ready!',
        text: 'Redirecting to WhatsApp to complete your order...',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonColor: '#25d366',
        background: '#fff',
        color: '#333'
    }).then(() => {
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Clear cart after opening WhatsApp
        cart = [];
        updateCartDisplay();
        closeCart();
    });
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile nav toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            const willOpen = !mobileNav.classList.contains('open');
            mobileNav.classList.toggle('open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
        
        // Close mobile nav when a link is clicked
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileNav.contains(event.target) && !menuToggle.contains(event.target)) {
                mobileNav.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Update copyright year automatically
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Add animation on scroll for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.feature-card, .product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});
