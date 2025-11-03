// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1500);
});

// Import and display tracks
import { tracks } from './tracks.js';

// Particle System
const particlesContainer = document.getElementById('particles');
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particlesContainer.appendChild(particle);
}

// Smooth Scroll
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

// Visualizer Animation
const visualizerBars = document.querySelectorAll('.visualizer-bar');
visualizerBars.forEach((bar, index) => {
    bar.style.animationDelay = (index * 0.05) + 's';
});

// Add track list rendering after visualizer animation section
function renderTrackList() {
    const audioPlayerContainer = document.querySelector('.audio-player-container');
    
    // Create track list container
    const trackListContainer = document.createElement('div');
    trackListContainer.className = 'track-list-container';
    trackListContainer.style.cssText = 'margin-top: 3rem; max-height: 600px; overflow-y: auto;';
    
    // Create track list
    const trackList = document.createElement('div');
    trackList.className = 'track-list';
    
    tracks.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            margin-bottom: 0.5rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        
        trackItem.innerHTML = `
            <div style="flex: 1;">
                <div style="color: #00ffff; font-weight: 700; margin-bottom: 0.25rem;">${index + 1}. ${track.title}</div>
                <div style="color: rgba(255, 255, 255, 0.5); font-size: 0.85rem;">${track.genre}</div>
            </div>
            <div style="display: flex; gap: 2rem; align-items: center;">
                <div style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">${track.duration}</div>
                <div style="color: rgba(255, 255, 255, 0.5); font-size: 0.85rem;">▶ ${track.plays}</div>
            </div>
        `;
        
        trackItem.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 255, 255, 0.1)';
            this.style.borderColor = 'rgba(0, 255, 255, 0.3)';
            this.style.transform = 'translateX(5px)';
        });
        
        trackItem.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(0, 0, 0, 0.3)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            this.style.transform = 'translateX(0)';
        });
        
        trackList.appendChild(trackItem);
    });
    
    trackListContainer.appendChild(trackList);
    
    // Insert before visualizer
    const visualizer = audioPlayerContainer.querySelector('.visualizer');
    audioPlayerContainer.insertBefore(trackListContainer, visualizer);
    
    // Add total tracks count
    const totalTracksDiv = document.createElement('div');
    totalTracksDiv.style.cssText = 'text-align: center; margin-top: 2rem; color: rgba(255, 255, 255, 0.6); font-size: 0.95rem;';
    totalTracksDiv.textContent = `Total: ${tracks.length} Tracks`;
    trackListContainer.appendChild(totalTracksDiv);
}

// Call renderTrackList after DOM is loaded
window.addEventListener('load', () => {
    renderTrackList();
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1500);
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.background-video, .neon-overlay');

    parallaxElements.forEach(element => {
        element.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
});

// Feature Cards Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .spec-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Dynamic Neon Glow on Mouse Move
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    document.querySelector('.neon-overlay').style.background = `
        radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
        radial-gradient(circle at ${(1-x) * 100}% ${(1-y) * 100}%, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(255, 255, 0, 0.1) 0%, transparent 70%)
    `;
});

// Carousel functionality
let currentSlide = 0;
const carouselTrack = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const indicatorsContainer = document.getElementById('carouselIndicators');
let autoplayInterval;

// Create indicators
for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('div');
    indicator.className = 'carousel-indicator';
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(i));
    indicatorsContainer.appendChild(indicator);
}

const indicators = document.querySelectorAll('.carousel-indicator');

function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoplay();
}

function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
}

function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

// Event listeners for carousel buttons
document.querySelector('.carousel-btn-prev').addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
});

document.querySelector('.carousel-btn-next').addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
});

// Start autoplay
startAutoplay();

// Pause autoplay when user hovers over carousel
document.querySelector('.carousel-wrapper').addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
});

document.querySelector('.carousel-wrapper').addEventListener('mouseleave', () => {
    startAutoplay();
});

// Console Easter Egg
console.log('%c🎧 AI LOUNGE AFTER DARK 🎧', 'font-size: 30px; color: #ff00ff; text-shadow: 0 0 10px #00ffff;');
console.log('%cBeats by DJ Smoke Stream', 'font-size: 16px; color: #00ffff;');
console.log('%cMidnight Ritual • 128 BPM • 8 Minutes of Sonic Excellence', 'font-size: 12px; color: #fff;');
console.log('%c⚠️ Note: MP3 files should be placed in the root directory for playback', 'font-size: 12px; color: #ffff00;');