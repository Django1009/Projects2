// ==================== CONTACT FORM HANDLER ====================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Log form data
            console.log('Form Submitted:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! I\'ll get back to you within 2-3 business days.');
            
            // Reset form
            contactForm.reset();
        });
    }
});

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for page-relative anchors
        if (href.startsWith('#')) {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ==================== NAVBAR SCROLL EFFECT ====================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ==================== IMAGE LAZY LOADING (OPTIONAL) ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                if (image.dataset.src) {
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                }
                imageObserver.unobserve(image);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== ACTIVE NAV LINK INDICATOR ====================
window.addEventListener('load', function() {
    const currentLocation = location.pathname.split('/').pop() || 'index.html';
    const menuItems = document.querySelectorAll('.nav-link');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href').split('/').pop() || 'index.html';
        if (href === currentLocation) {
            item.style.color = '#667eea';
            item.style.fontWeight = '700';
        }
    });
});

// ==================== GALLERY ITEM ANIMATION ====================
const galleryItems = document.querySelectorAll('.gallery-item');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

if ('IntersectionObserver' in window) {
    const galleryObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                galleryObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s, transform 0.6s';
        galleryObserver.observe(item);
    });
}

// ==================== STEP CARD ANIMATION ====================
const stepCards = document.querySelectorAll('.step-card');

if ('IntersectionObserver' in window) {
    const stepObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                stepObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stepCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s, transform 0.6s';
        stepObserver.observe(card);
    });
}

console.log('Domnick Portfolio Website Loaded Successfully');
