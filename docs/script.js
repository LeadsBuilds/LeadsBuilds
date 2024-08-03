document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18next
    i18next
        .use(i18nextHttpBackend) // Use the backend plugin
        .init({
            lng: 'en', // Default language
            fallbackLng: 'en', // Fallback language if the selected language is not available
            ns: ['translation'],
            defaultNS: 'translation',
            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json' // Path to your translation JSON files
            }
        }, function(err, t) {
            if (err) {
                console.error('i18next initialization error:', err);
                return;
            }
            updateContent();
        });

    // Function to update content with i18next
    function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.innerHTML = i18next.t(el.getAttribute('data-i18n'));
        });
    }

    // Language switcher
    document.getElementById('language-select').addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        i18next.changeLanguage(selectedLanguage, () => {
            updateContent();
        });
    });

    // Slider functionality
    let slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        slides[currentSlide].style.opacity = 1;

        setInterval(() => {
            if (slides.length > 0) {
                slides[currentSlide].style.opacity = 0;
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].style.opacity = 1;
            }
        }, 4000);
    } else {
        console.warn('No slides found.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const username = 'LeadsBuilds';
    const repoContainer = document.getElementById('repo-container');
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=pushed`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(repos => {
            repos.forEach(repo => {
                if (repo.fork === true) return;
                if (repo.name === username) return;
                const repoSection = document.createElement('section');
                repoSection.className = 'section';

                repoSection.innerHTML = `
                    <h2>${repo.name}</h2>
                    <p>${repo.description || 'No description available'}</p>
                    <a href="${repo.html_url}" class="button" data-i18n="a.button" target="_blank">View Repository</a>
                `;

                repoContainer.appendChild(repoSection);
            });

            // Intersection Observer for animations
            const sections = document.querySelectorAll('.section');
            const options = {
                threshold: 0.25
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, options);
        
            if (sections.length > 0) {
                sections.forEach(section => {
                    observer.observe(section);
                });
            } else {
                console.warn('No sections found.');
            }
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
        });
});
