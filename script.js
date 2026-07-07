/**
 * XIAOAN ZHANG PORTFOLIO - SCRIPT LOGIC
 * Layout style: Brittany Chiang split-screen
 * Interactive features: Dynamic cursor spotlight, Scroll-Spy stretching nav-lines,
 *                       Contact validation, Back-to-top trigger.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Dynamic Cursor Spotlight Glow
    // ==========================================
    const spotlight = document.querySelector('.cursor-spotlight');

    if (spotlight) {
        document.addEventListener('mousemove', (e) => {
            // High-performance direct update of background inline style
            // Radial-gradient centering is updated dynamically to match cursor coordinates
            spotlight.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(140, 111, 61, 0.065), transparent 80%)`;
        });
    }


    // ==========================================
    // 2. High-Performance Scroll-Spy Navigation
    // ==========================================
    const sections = document.querySelectorAll('.content-section');
    const navAnchors = document.querySelectorAll('.nav-anchor');

    if (sections.length > 0 && navAnchors.length > 0) {
        const observerOptions = {
            root: null,
            // Trigger active state when section occupies the focus hot-zone (20% to 60% of viewport from top)
            rootMargin: '-25% 0px -55% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeSectionId = entry.target.getAttribute('id');
                    
                    navAnchors.forEach(anchor => {
                        const href = anchor.getAttribute('href');
                        if (href === `#${activeSectionId}`) {
                            anchor.classList.add('active');
                        } else {
                            anchor.classList.remove('active');
                        }
                    });
                }
            });
        };

        const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }


    // ==========================================
    // 3. Contact Form Submission Handling
    // ==========================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            if (!name || !email || !subject || !message) {
                displayFeedback('Please complete all form sections.', 'error');
                return;
            }

            // Visual button loader triggers
            const btnOriginalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending message <i class="fa-solid fa-spinner fa-spin"></i>';

            // Web3Forms AJAX POST submission
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: 'YOUR_ACCESS_KEY_HERE', // REPLACE WITH YOUR ACCESS KEY FROM WEB3FORMS.COM
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                })
            })
            .then(async (response) => {
                const json = await response.json();
                submitBtn.disabled = false;
                submitBtn.innerHTML = btnOriginalHTML;

                if (response.status === 200 && json.success) {
                    displayFeedback('Message sent successfully! Xiaoan will contact you soon.', 'success');
                    contactForm.reset();
                } else {
                    displayFeedback(json.message || 'Something went wrong. Please try again.', 'error');
                }
            })
            .catch((error) => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = btnOriginalHTML;
                displayFeedback('Network error. Please try again later.', 'error');
            });
        });
    }

    const displayFeedback = (msg, state) => {
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback ${state}`;
        formFeedback.style.display = 'block';

        // Animate exit opacity transition
        setTimeout(() => {
            formFeedback.style.opacity = '0';
            setTimeout(() => {
                formFeedback.style.display = 'none';
                formFeedback.style.opacity = '1';
            }, 400);
        }, 5000);
    };


    // ==========================================
    // 4. Back-to-Top Toggle (Mobile Navigation Fallback)
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
