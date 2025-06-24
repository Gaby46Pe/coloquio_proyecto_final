// script.js
let currentSlide = 1;
const totalSlides = 8;

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    updateSlideCounter();
    updateProgress();
    updateNavigationButtons();
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            previousSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Initialize demo tabs
    initializeDemoTabs();
    
    // Add animation delays for better UX
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Navigation functions
function nextSlide() {
    if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
    }
}

function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;
    
    // Hide current slide
    const currentSlideElement = document.getElementById(`slide${currentSlide}`);
    if (currentSlideElement) {
        currentSlideElement.classList.remove('active');
    }
    
    // Update current slide number
    currentSlide = slideNumber;
    
    // Show new slide
    const newSlideElement = document.getElementById(`slide${currentSlide}`);
    if (newSlideElement) {
        newSlideElement.classList.add('active');
    }
    
    // Update UI
    updateSlideCounter();
    updateProgress();
    updateNavigationButtons();
    
    // Trigger slide-specific animations
    triggerSlideAnimations(currentSlide);
}

function updateSlideCounter() {
    const currentSlideSpan = document.getElementById('current-slide');
    const totalSlidesSpan = document.getElementById('total-slides');
    
    if (currentSlideSpan) currentSlideSpan.textContent = currentSlide;
    if (totalSlidesSpan) totalSlidesSpan.textContent = totalSlides;
}

function updateProgress() {
    const progress = document.getElementById('progress');
    if (progress) {
        const percentage = (currentSlide / totalSlides) * 100;
        progress.style.width = percentage + '%';
    }
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides;
    }
}

// Demo tabs functionality
function initializeDemoTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Slide-specific animations
function triggerSlideAnimations(slideNumber) {
    const slide = document.getElementById(`slide${slideNumber}`);
    if (!slide) return;
    
    // Remove existing animation classes
    const animatedElements = slide.querySelectorAll('.animate-in');
    animatedElements.forEach(el => el.classList.remove('animate-in'));
    
    // Add animation classes with delays
    const elementsToAnimate = slide.querySelectorAll('.member, .problem-item, .feature, .diff-item, .metric, .achievement, .pricing-card, .tech-category');
    
    elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-in');
        }, index * 100);
    });
    
    // Special animations for specific slides
    switch(slideNumber) {
        case 1:
            animateTeamMembers();
            break;
        case 3:
            animateEcosystemDiagram();
            break;
        case 4:
            animatePricingCards();
            break;
        case 7:
            animateMetrics();
            break;
    }
}

function animateTeamMembers() {
    const members = document.querySelectorAll('.member');
    members.forEach((member, index) => {
        setTimeout(() => {
            member.style.animation = `slideInUp 0.6s ease-out ${index * 0.2}s both`;
        }, 500);
    });
}

function animateEcosystemDiagram() {
    const nodes = document.querySelectorAll('.ecosystem-node');
    const center = document.querySelector('.ecosystem-center');
    
    if (center) {
        setTimeout(() => {
            center.style.animation = 'zoomIn 0.8s ease-out both';
        }, 500);
    }
    
    nodes.forEach((node, index) => {
        setTimeout(() => {
            node.style.animation = `slideInFromEdge 0.8s ease-out ${index * 0.3}s both`;
        }, 800);
    });
}

function animatePricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `slideInUp 0.6s ease-out ${index * 0.2}s both`;
        }, 500);
    });
}

function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-number');
    metrics.forEach((metric, index) => {
        setTimeout(() => {
            animateCounter(metric);
        }, index * 200);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + '%';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '%';
        }
    }, 16);
}

// Auto-play functionality (optional)
let autoPlayInterval;
let isAutoPlaying = false;

function startAutoPlay() {
    if (isAutoPlaying) return;
    
    isAutoPlaying = true;
    autoPlayInterval = setInterval(() => {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else {
            stopAutoPlay();
        }
    }, 10000); // 10 seconds per slide
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    isAutoPlaying = false;
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            previousSlide();
        }
    }
}

// Additional CSS animations (to be added via JavaScript)
const additionalStyles = `
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: scale(0.5);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideInFromEdge {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation: slideInUp 0.6s ease-out both;
}

.loaded .slide-content {
    animation-delay: 0.2s;
}

/* Enhanced hover effects */
.member:hover,
.problem-item:hover,
.feature:hover,
.diff-item:hover,
.metric:hover,
.achievement:hover {
    transform: translateY(-8px) scale(1.02);
}

.pricing-card:hover {
    transform: translateY(-15px) scale(1.05);
}

/* Pulse effect for CTA button */
.cta-button {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    }
    50% {
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.6);
    }
    100% {
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    }
}

/* Loading animation */
.presentation-container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 9999;
    opacity: 1;
    transition: opacity 0.5s ease;
}

.loaded .presentation-container::before {
    opacity: 0;
    pointer-events: none;
}
`;

// Add additional styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export functions for global access
window.nextSlide = nextSlide;
window.previousSlide = previousSlide;
window.goToSlide = goToSlide;
window.startAutoPlay = startAutoPlay;
window.stopAutoPlay = stopAutoPlay;