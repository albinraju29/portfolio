// certificate.js
document.addEventListener('DOMContentLoaded', () => {
    // Get certificate data from session storage
    const certData = JSON.parse(sessionStorage.getItem('certData'));
    
    if (!certData) {
        // If no data, redirect back to certifications
        window.location.href = 'index.html#certifications';
        return;
    }
    
    // Update page elements
    document.querySelector('.certificate-header h1').textContent = certData.title;
    document.querySelector('.certificate-header p').textContent = `Issued by ${certData.issuer} • ${certData.date}`;
    
    const certImageElement = document.querySelector('.certificate-image');
    certImageElement.src = certData.image;
    certImageElement.alt = `${certData.title} Certificate`;
    
    // Set verification button URL
    const verifyButton = document.querySelector('.verify-button');
    verifyButton.href = certData.verifyUrl;
    
    // Set dynamic content
    const aboutSection = document.querySelector('.detail-item:nth-child(1) p');
    const skillsSection = document.querySelector('.detail-item:nth-child(2) p');
    
    aboutSection.textContent = certData.description;
    
    // Initialize theme and menu
    initThemeToggle();
    initMobileMenu();
});


function setDynamicContent(title, issuer) {
    const aboutSection = document.querySelector('.detail-item:nth-child(1) p');
    const skillsSection = document.querySelector('.detail-item:nth-child(2) p');
    const verifyButton = document.querySelector('.verify-button');
    
    // Default content
    let aboutText = `This certification validates successful completion of the ${title} program.`;
    let skillsText = `• Core concepts of ${title.split(' ')[0]}\n• Practical applications\n• Best practices`;
    let verifyLink = '#';
    
    // Custom content for different certificate types
    if (issuer.includes('LetsUpgrade')) {
        aboutText = `This certification validates successful completion of the ${title} program offered by LetsUpgrade. The program covered fundamental and advanced concepts with practical applications.`;
        skillsText = `• ${title.split(' ')[0]} Fundamentals\n• Practical Implementation\n• Problem Solving\n• Best Practices`;
        verifyLink = 'https://www.letsupgrade.in/verify';
    } else if (issuer.includes('Oracle')) {
        aboutText = `This Oracle certification demonstrates proficiency in ${title}. It validates skills and knowledge at a professional level.`;
        skillsText = `• Database Design\n• SQL Proficiency\n• Performance Tuning\n• Security Implementation`;
        verifyLink = 'https://education.oracle.com/verification';
    } else if (issuer.includes('LinkedIn')) {
        aboutText = `This LinkedIn Learning certificate confirms completion of the "${title}" course, demonstrating commitment to professional development.`;
        skillsText = `• Theoretical Understanding\n• Practical Applications\n• Industry Best Practices`;
        verifyLink = 'https://www.linkedin.com/learning/';
    }
    
    // Update elements
    aboutSection.textContent = aboutText;
    skillsSection.innerHTML = skillsText.replace(/\n/g, '<br>');
    verifyButton.href = verifyLink;
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Set initial theme
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    icon.className = currentTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

function initMobileMenu() {
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('nav');
    
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('fa-xmark');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuIcon.classList.remove('fa-xmark');
        });
    });
}