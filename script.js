/* ==========================================================================
   JIMSHAD P - PORTFOLIO INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Loader Screen Simulation & Smooth Entrance
    const loaderScreen = document.getElementById('loader-screen');
    const loaderProgress = document.getElementById('loader-progress');

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 15;
        if (loaderProgress) loaderProgress.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                if (loaderScreen) loaderScreen.classList.add('fade-out');
            }, 300);
        }
    }, 60);

    // 2. Particle Canvas System (Neural Network & AI Particles)
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 15), 80);
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // Move custom cursor glow
            const glow = document.getElementById('cursor-glow');
            const dot = document.getElementById('cursor-dot');
            if (glow) { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; }
            if (dot) { dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`; }
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.color = Math.random() > 0.5 ? '#00f2fe' : '#9d4edd';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 120 * 0.8})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // 3. Typing Effect for Hero Section
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const phrases = ['AI & Data Science Specialist', 'Data Analyst', 'Machine Learning Enthusiast'];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIdx === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(typeLoop, typeSpeed);
        }
        typeLoop();
    }

    // 4. Scroll Progress, Navbar & Back to Top
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (scrollProgress) scrollProgress.style.width = `${scrolled}%`;

        if (navbar) {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }

        if (backToTop) {
            if (window.scrollY > 400) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    }

    // 5. Dark / Light Theme Toggle with LocalStorage Persistence
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('jimshad_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('jimshad_theme', newTheme);
        });
    }

    // 6. Project Filtering & Real-Time Search
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectSearch = document.getElementById('project-search');

    function filterProjects() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const searchQuery = projectSearch ? projectSearch.value.toLowerCase().trim() : '';

        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            const keywords = card.getAttribute('data-keywords');

            const matchesCategory = activeFilter === 'all' || categories.includes(activeFilter);
            const matchesSearch = searchQuery === '' || keywords.includes(searchQuery) || card.textContent.toLowerCase().includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects();
        });
    });

    if (projectSearch) {
        projectSearch.addEventListener('input', filterProjects);
    }

    // 7. Live GitHub Integration & Dynamic Repository Fetching
    const githubUser = 'jimshadp2007-beep';
    const recentReposContainer = document.getElementById('recent-repos-container');
    const ghReposCount = document.getElementById('gh-repos-count');
    const ghFollowers = document.getElementById('gh-followers');
    const ghStars = document.getElementById('gh-stars');

    // Populate GitHub Contribution Matrix
    const contribBoxes = document.getElementById('contrib-boxes');
    if (contribBoxes) {
        for (let i = 0; i < 120; i++) {
            const sq = document.createElement('div');
            const lvl = Math.floor(Math.random() * 5);
            sq.className = `contrib-sq sq-${lvl}`;
            contribBoxes.appendChild(sq);
        }
    }

    async function fetchGitHubData() {
        try {
            // Fetch User Details
            const userRes = await fetch(`https://api.github.com/users/${githubUser}`);
            if (userRes.ok) {
                const userData = await userRes.json();
                if (ghReposCount) ghReposCount.textContent = userData.public_repos;
                if (ghFollowers) ghFollowers.textContent = userData.followers;
            }

            // Fetch Public Repositories
            const reposRes = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=6`);
            if (reposRes.ok) {
                const repos = await reposRes.json();
                if (recentReposContainer) {
                    recentReposContainer.innerHTML = ''; // clear loading

                    let totalStars = 0;
                    repos.forEach(repo => {
                        totalStars += repo.stargazers_count;
                        const repoCard = document.createElement('div');
                        repoCard.className = 'repo-card';
                        repoCard.innerHTML = `
                            <h5><i class="fa-solid fa-book-bookmark"></i> ${repo.name}</h5>
                            <p>${repo.description || 'Data analytics & machine learning repository by Jimshad P.'}</p>
                            <div class="repo-meta">
                                <span><i class="fa-solid fa-code"></i> ${repo.language || 'Python'}</span>
                                <span><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>
                                <span><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
                            </div>
                        `;
                        recentReposContainer.appendChild(repoCard);
                    });

                    if (ghStars) ghStars.textContent = totalStars;
                }
            }
        } catch (err) {
            console.log('GitHub API Live Sync error or offline mode:', err);
            if (recentReposContainer) {
                recentReposContainer.innerHTML = `
                    <div class="repo-card">
                        <h5>Rainfall-Analysis-Dashboard</h5>
                        <p>End-to-end rainfall analytics solution built with Python & Power BI.</p>
                        <div class="repo-meta"><span>Python</span><span>⭐ 2</span></div>
                    </div>
                    <div class="repo-card">
                        <h5>Loan-Approval-Prediction</h5>
                        <p>ML classification system evaluating borrower approval probabilities.</p>
                        <div class="repo-meta"><span>Python</span><span>⭐ 3</span></div>
                    </div>
                    <div class="repo-card">
                        <h5>India-GDP-Growth-Prediction</h5>
                        <p>Economic trend forecasting using XGBoost and Random Forest regression.</p>
                        <div class="repo-meta"><span>Python</span><span>⭐ 1</span></div>
                    </div>
                `;
            }
        }
    }
    fetchGitHubData();

    // 8. Interactive AI Assistant Widget ("Jimshad P Assistant")
    const aiWidgetToggle = document.getElementById('ai-widget-toggle');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const aiCloseBtn = document.getElementById('ai-close-btn');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const aiChatBody = document.getElementById('ai-chat-body');

    if (aiWidgetToggle && aiChatWindow) {
        aiWidgetToggle.addEventListener('click', () => {
            aiChatWindow.classList.toggle('hidden');
        });
        if (aiCloseBtn) {
            aiCloseBtn.addEventListener('click', () => aiChatWindow.classList.add('hidden'));
        }
    }

    const aiKnowledge = [
        { keywords: ['skill', 'python', 'sql', 'power bi', 'technologies', 'know'], response: 'Jimshad P is skilled in Python, SQL/MySQL, Power BI, Pandas, NumPy, Scikit-learn, and TensorFlow. He specializes in Data Cleaning, EDA, Feature Engineering, and ML Classification/Regression!' },
        { keywords: ['project', 'machine learning', 'rainfall', 'loan', 'gdp'], response: 'Jimshad has built 3 flagship projects: 1) Rainfall Analysis Dashboard (Power BI/Python), 2) Loan Approval Prediction (ML Classification with SMOTE), and 3) India GDP Growth Rate Prediction (XGBoost/Random Forest).' },
        { keywords: ['education', 'study', 'iqjita', 'diploma'], response: 'Jimshad P is currently pursuing his Diploma in AI and Data Science at IQJITA Innovative LLP (June 2025 – June 2026).' },
        { keywords: ['hire', 'internship', 'available', 'job', 'work'], response: 'Yes! Jimshad is actively seeking AI/Data Science internships, entry-level Data Analyst positions, and collaborative open-source projects.' },
        { keywords: ['contact', 'email', 'phone', 'linkedin', 'reach'], response: 'You can email Jimshad at jimshadp2007@gmail.com, call +91 9633784565, or connect on LinkedIn at linkedin.com/in/jimshad-p-906b72384!' }
    ];

    function handleAiChat(userText) {
        if (!userText.trim()) return;

        // Append User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-bubble user-bubble';
        userMsg.textContent = userText;
        aiChatBody.appendChild(userMsg);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;

        aiInput.value = '';

        // Bot Thinking & Answer
        setTimeout(() => {
            let reply = "I'm Jimshad P's assistant. You can ask me about his ML projects, tech stack in Python & SQL, or contact information!";
            const textLower = userText.toLowerCase();

            for (const item of aiKnowledge) {
                if (item.keywords.some(kw => textLower.includes(kw))) {
                    reply = item.response;
                    break;
                }
            }

            const botMsg = document.createElement('div');
            botMsg.className = 'chat-bubble bot-bubble';
            botMsg.textContent = reply;
            aiChatBody.appendChild(botMsg);
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
        }, 500);
    }

    if (aiSendBtn && aiInput) {
        aiSendBtn.addEventListener('click', () => handleAiChat(aiInput.value));
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAiChat(aiInput.value);
        });
    }

    document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleAiChat(btn.textContent);
        });
    });

    // 9. Contact Form Validation & Trigger
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

            setTimeout(() => {
                submitBtn.style.background = '#10b981';
                submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Sent Successfully!`;
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
                }, 4000);
            }, 1000);
        });
    }
});
