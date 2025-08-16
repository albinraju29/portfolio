document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Hide loading overlay when page is loaded
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    const projectId = new URLSearchParams(window.location.search).get('id');
    console.log('Project ID from URL:', projectId);
    
    if (!projectId) {
        console.error('No project ID found in URL');
        return;
    }

    fetch('projects.json')
        .then(response => {
            console.log('Fetch response received');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('JSON data loaded:', data);
            
            if (!data.projects) {
                console.error('No projects array found in JSON');
                return;
            }
            
            const project = data.projects.find(p => p.id === projectId);
            console.log('Found project:', project);
            
            if (project) {
                renderProject(project);
            } else {
                console.error('Project not found with ID:', projectId);
            }
        })
        .catch(error => {
            console.error('Error loading project data:', error);
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        });
});

function renderProject(project) {
    console.log('Rendering project:', project);
    
    // Helper function to safely set content
    function setContent(id, content) {
        const element = document.getElementById(id);
        if (element) element.textContent = content || 'Not specified';
    }

    // Basic Info
    setContent('project-title', project.title);
    setContent('project-subtitle', project.subtitle);
    setContent('project-description', project.description);
    
    // Metadata
    setContent('project-date', project.date);
    setContent('project-status', project.status);
    setContent('project-team', project.team);
    
    // Links
    const setLink = (id, url) => {
        const link = document.getElementById(id);
        if (link) link.href = url || '#';
    };
    setLink('live-demo-btn', project.demo);
    setLink('source-code-btn', project.code);
    
    // Features List
    const featuresList = document.getElementById('project-features');
    if (featuresList && project.features) {
        featuresList.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    }
    
    // Tech Tags
    const techContainer = document.getElementById('tech-tags');
    if (techContainer && project.tech) {
        techContainer.innerHTML = '';
        project.tech.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            techContainer.appendChild(tag);
        });
    }
    
    // Challenges
    const challengesContainer = document.getElementById('challenges-content');
    if (challengesContainer && project.challenges) {
        challengesContainer.innerHTML = '';
        project.challenges.forEach(challenge => {
            const div = document.createElement('div');
            div.className = 'challenge-item';
            div.innerHTML = `
                <h3>${challenge.problem || 'Challenge not specified'}</h3>
                <p><strong>Solution:</strong> ${challenge.solution || 'Not specified'}</p>
            `;
            challengesContainer.appendChild(div);
        });
    }
    
    // Results
    const resultsList = document.getElementById('results-content');
    if (resultsList && project.results) {
        resultsList.innerHTML = '';
        project.results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result;
            resultsList.appendChild(li);
        });
    }
    
    // Image Gallery with Slider Functionality
    const gallery = document.getElementById('image-gallery');
    const dotsContainer = document.getElementById('slider-dots');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    
    if (gallery && project.screenshots) {
        gallery.innerHTML = '';
        
        // Create slides
        project.screenshots.forEach((screenshot, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            
            const img = document.createElement('img');
            img.src = screenshot;
            img.alt = `${project.title || 'Project'} screenshot ${index + 1}`;
            
            slide.appendChild(img);
            gallery.appendChild(slide);
        });

        // Slider functionality
        let currentIndex = 0;
        const slides = gallery.children;
        const slideCount = slides.length;
        
        function updateSlider() {
            gallery.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }
        
        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.children;
            for (let i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('active', i === currentIndex);
            }
        }
        
        // Navigation buttons
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateSlider();
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateSlider();
        });
        
        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'slider-dot';
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        gallery.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
        
        function handleSwipe() {
            const threshold = 50; // Minimum swipe distance
            const difference = touchStartX - touchEndX;
            
            if (difference > threshold) {
                // Swipe left - next
                currentIndex = (currentIndex + 1) % slideCount;
            } else if (difference < -threshold) {
                // Swipe right - previous
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            }
            
            updateSlider();
        }
        
        // Auto-advance slides (optional)
        // let slideInterval = setInterval(() => {
        //     currentIndex = (currentIndex + 1) % slideCount;
        //     updateSlider();
        // }, 5000);
        
        // gallery.addEventListener('mouseenter', () => clearInterval(slideInterval));
        // gallery.addEventListener('mouseleave', () => {
        //     slideInterval = setInterval(() => {
        //         currentIndex = (currentIndex + 1) % slideCount;
        //         updateSlider();
        //     }, 5000);
        // });
    }
}

// Example theme toggle function
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
}

// Call this when the page loads
initializeTheme();