/**
 * Jarvis-inspired Sci-Fi Portfolio
 * Author: Truong Minh Triet
 * Theme: Iron Man Jarvis UI
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the website
    initLoading();
    initNavigation();
    initTypingEffect();
    initContactForm();
});

/**
 * Loading Screen Animation
 */
function initLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingPercentage = document.querySelector('.loading-percentage');
    
    // Update loading percentage text
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        loadingPercentage.textContent = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Hide loading screen with fade out effect
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 800);
            }, 500);
        }
    }, 30);
}

/**
 * Navigation and Section Switching
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get the section id from the href attribute
            const sectionId = link.getAttribute('href');
            
            // Hide all sections
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('active-section');
            });
            
            // Show the selected section
            document.querySelector(sectionId).classList.add('active-section');
            
            // Add section name to URL hash
            window.location.hash = sectionId;
        });
    });
    
    // Handle initial load or direct link to section
    function handleInitialNavigation() {
        let targetSection = window.location.hash || '#home';
        
        // Remove active class from all links
        navLinks.forEach(item => item.classList.remove('active'));
        
        // Add active class to the link that matches the hash
        document.querySelector(`a[href="${targetSection}"]`).classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
        });
        
        // Show the target section
        document.querySelector(targetSection).classList.add('active-section');
    }
    
    // Handle navigation when hash changes
    window.addEventListener('hashchange', handleInitialNavigation);
    
    // Handle initial load
    setTimeout(handleInitialNavigation, 3500); // Wait for loading screen to finish
}

/**
 * Typing Effect on Home Page
 */
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    const phrases = [
        'Welcome to my portfolio',
        'Embedded Systems Engineer',
        'Hardware Designer',
        'Firmware Developer',
        'Robotics Enthusiast'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Deleting text
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Typing text
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // If word is complete, start deleting after a pause
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause before deleting
        }
        
        // If deletion is complete, move to next phrase
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing effect after loading screen
    setTimeout(type, 4000);
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const subject = document.getElementById('subject').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!subject || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Create mailto link
            const mailtoLink = `mailto:minhtrietwork@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + email + '\n\n' + message)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success notification
            showNotification('Opening email client...', 'success');
            
            // Reset form after a delay
            setTimeout(() => {
                contactForm.reset();
            }, 2000);
        });
    }
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Add Jarvis-like HUD animations
 */
function initHudAnimations() {
    // Add random data points to HUD elements
    const hudElements = document.querySelectorAll('.hud-element');
    
    hudElements.forEach(element => {
        const dataPoints = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < dataPoints; i++) {
            const dataPoint = document.createElement('div');
            dataPoint.className = 'hud-data-point';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            dataPoint.style.left = `${x}%`;
            dataPoint.style.top = `${y}%`;
            
            element.appendChild(dataPoint);
        }
    });
}

// Initialize HUD animations
initHudAnimations();

/**
 * Add smooth scrolling for internal links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Add CSS class for notification styling
 */
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: var(--bg-light);
        color: var(--text-primary);
        border-radius: 4px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        font-family: var(--font-primary);
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        border-left: 4px solid #27c93f;
    }
    
    .notification.error {
        border-left: 4px solid #ff5f56;
    }
    
    .notification.info {
        border-left: 4px solid var(--primary-blue);
    }
    
    .hud-data-point {
        position: absolute;
        width: 4px;
        height: 4px;
        background-color: var(--primary-blue);
        border-radius: 50%;
        box-shadow: 0 0 5px var(--primary-blue);
        animation: pulse 2s infinite;
    }
`;

document.head.appendChild(style);
