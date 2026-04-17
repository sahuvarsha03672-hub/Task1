//  --------------------- Create floating particles starts here ----------------------
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}
// Initialize particles on page load
createParticles();

//  --------------------- Create floating particles ends here ----------------------


// ----------------------- Filter functionality starts here -------------------------
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.slide');

filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');

        // Filter projects
        projectCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
                // Reset animation
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = '';
                }, 10);
            } else {
                const categories = card.getAttribute('data-category').split(' ');
                if (categories.includes(filter)) {
                    card.style.display = 'block';
                    // Reset animation
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            }
        });

        // projectCards.forEach(card => {
        //     const categories = card.getAttribute('data-category') || "";

        //     if (filter === 'all' || categories.includes(filter)) {
        //         card.style.display = 'flex';
        //     } else {
        //         card.style.display = 'none';
        //     }
        // });
        
    });
});

// ----------------------- Filter functionality ends here -------------------------


// ----------------------- Main functionality starts here -------------------------
document.addEventListener('DOMContentLoaded', () => {
    // -------- Elements --------
    const track = document.getElementById('track');
    const slides = Array.from(track.children);
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    const progressBar = document.getElementById('progressBar');
    const sliderWrapper = document.getElementById('sliderWrapper');

    // -------- state --------
    let currentIndex = 0;
    const slideCount = slides.length;
    const autoPlayDelay = 5000;  // 5 seconds
    let isAutoPlaying = true;
    let autoPlayTimer;
    let progressTimer;

    // ---- Initialization ----

    // 1. Create Thumbnails
    slides.forEach((slide, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');

        // 🔥 Get image from slide
        const img = slide.querySelector('img').src;

        // Create thumbnail image
        thumbnail.innerHTML = `<img src="${img}" alt="thumb">`;

        if (index === 0) thumbnail.classList.add('active');

        thumbnail.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });

        thumbnailsContainer.appendChild(thumbnail);

    });

    const thumbnails = Array.from(thumbnailsContainer.children);

    // 2. Initial Setup
    updateSliderPosition();
    startAutoPlay();

    // ----------- Core Functions -------------

    function updateSliderPosition() {
        // Move Track
        const amountToMove = -100 * currentIndex;
        track.style.transform = "none";

        // Update Active Classes (for content animation and zoom)
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });

        // Update Thumbnails
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === currentIndex);
        });
    }


    function goToSlide(index) {
        // Boundary checks
        if (index < 0) {
            currentIndex = slideCount - 1;
        } else if (index >= slideCount) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        updateSliderPosition();
    }


    function nextSlide() {
        goToSlide(currentIndex + 1);
    }


    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // --- Auto Play Logic ---

    function startAutoPlay() {
        if (!isAutoPlaying) return;

        // Clear existing animations
        clearInterval(autoPlayTimer);
        progressBar.classList.remove('animating-progress');

        // Trigger reflow to restart CSS animation
        void progressBar.offsetWidth;

        // Start Progress Bar Animation
        progressBar.classList.add('animating-progress');
        progressBar.style.animationDuration = `${autoPlayDelay}ms`;

        // Set timer for actual slide change
        autoPlayTimer = setInterval(() => {
            nextSlide();
            // Reset progress animation immediately for the next slide
            resetProgressAnimation();
        }, autoPlayDelay);
    }

    function stopAutoPlay() {
        isAutoPlaying = false;
        clearInterval(autoPlayTimer);
        progressBar.classList.remove('animating-progress');
        progressBar.style.width = '100%'; // Keep it full looking or freeze it? Let's remove it visually
        progressBar.style.width = '0%';
    }

    function resetProgressAnimation() {
        progressBar.classList.remove('animating-progress');
        void progressBar.offsetWidth; // Trigger reflow
        if (isAutoPlaying) {
            progressBar.classList.add('animating-progress');
            progressBar.style.animationDuration = `${autoPlayDelay}ms`;
        }
    }

    function resetAutoPlay() {
        if (isAutoPlaying) {
            startAutoPlay();
        }
    }



    // ---------------- Event Listeners --------------

    // Pause on Hover
    sliderWrapper.addEventListener('mouseenter', () => {
        if (isAutoPlaying) {
            stopAutoPlay();
        }
    });

    sliderWrapper.addEventListener('mouseleave', () => {
        isAutoPlaying = true;
        startAutoPlay();
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });

    // Touch Support (Simple Swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay(); // Pause while touching
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        isAutoPlaying = true;
        startAutoPlay(); // Resume after touch
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50; // Min swipe distance
        if (touchEndX < touchStartX - threshold) {
            nextSlide();
        }
        if (touchEndX > touchStartX + threshold) {
            prevSlide();
        }
    }

});

// ----------------------- Main functionality ends here -------------------------
