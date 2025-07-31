// ===== THEME TOGGLE FUNCTIONALITY =====
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// ===== VIEW TOGGLE FUNCTIONALITY =====
class ViewToggle {
    constructor() {
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.postsGrid = document.getElementById('postsGrid');
        this.init();
    }

    init() {
        this.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.view-btn').dataset.view;
                this.setView(view);
            });
        });
    }

    setView(view) {
        // Update active button
        this.viewButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Update grid class
        if (this.postsGrid) {
            this.postsGrid.className = view === 'list' ? 'posts-grid list-view' : 'posts-grid';
        }
    }
}

// ===== SEARCH FUNCTIONALITY =====
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchBtn = document.querySelector('.search-btn');
        this.posts = document.querySelectorAll('.post-card');
        this.init();
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => {
                this.handleSearch(this.searchInput.value);
            });
        }
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        this.posts.forEach(post => {
            const title = post.querySelector('.post-title a')?.textContent.toLowerCase() || '';
            const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
            const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const isMatch = title.includes(searchTerm) || 
                           excerpt.includes(searchTerm) || 
                           tags.includes(searchTerm);
            
            post.style.display = isMatch || searchTerm === '' ? 'block' : 'none';
        });
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

// ===== FORM HANDLING =====
class FormManager {
    constructor() {
        this.newsletterForms = document.querySelectorAll('.newsletter-form');
        this.commentForm = document.querySelector('.comment-form form');
        this.init();
    }

    init() {
        // Newsletter forms
        this.newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        });

        // Comment form
        if (this.commentForm) {
            this.commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        }
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        
        // Simulate API call
        this.showNotification('Thanks for subscribing! We\'ll keep you updated.', 'success');
        form.reset();
    }

    handleCommentSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Simulate comment submission
        this.showNotification('Comment submitted successfully!', 'success');
        form.reset();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            backgroundColor: type === 'success' ? 'var(--success)' : 'var(--accent-primary)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// ===== LAZY LOADING FOR IMAGES =====
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }
}

// ===== READING PROGRESS INDICATOR =====
class ReadingProgress {
    constructor() {
        this.progressBar = null;
        this.init();
    }

    init() {
        // Only add reading progress on post pages
        if (document.querySelector('.post-article')) {
            this.createProgressBar();
            this.updateProgress();
            window.addEventListener('scroll', () => this.updateProgress());
        }
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'reading-progress';
        
        Object.assign(this.progressBar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '0%',
            height: '3px',
            backgroundColor: 'var(--accent-primary)',
            zIndex: '1001',
            transition: 'width 0.1s ease'
        });
        
        document.body.appendChild(this.progressBar);
    }

    updateProgress() {
        const article = document.querySelector('.post-article');
        if (!article || !this.progressBar) return;

        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        const progress = Math.min(
            Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
            1
        );

        this.progressBar.style.width = `${progress * 100}%`;
    }
}

// ===== LOAD MORE FUNCTIONALITY =====
class LoadMore {
    constructor() {
        this.loadMoreBtn = document.querySelector('.load-more-section .btn');
        this.postsGrid = document.getElementById('postsGrid');
        this.init();
    }

    init() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }
    }

    loadMorePosts() {
        // Simulate loading more posts
        this.loadMoreBtn.textContent = 'Loading...';
        this.loadMoreBtn.disabled = true;

        setTimeout(() => {
            // In a real application, you would fetch more posts from an API
            this.showNotification('No more posts to load', 'info');
            this.loadMoreBtn.textContent = 'Load More Posts';
            this.loadMoreBtn.disabled = false;
        }, 1000);
    }

    showNotification(message, type) {
        const formManager = new FormManager();
        formManager.showNotification(message, type);
    }
}

// ===== MOBILE MENU TOGGLE =====
class MobileMenu {
    constructor() {
        this.header = document.querySelector('.header');
        this.nav = document.querySelector('.nav');
        this.init();
    }

    init() {
        // Create mobile menu toggle button
        if (window.innerWidth <= 768) {
            this.createMobileToggle();
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768 && !this.mobileToggle) {
                this.createMobileToggle();
            } else if (window.innerWidth > 768 && this.mobileToggle) {
                this.removeMobileToggle();
            }
        });
    }

    createMobileToggle() {
        this.mobileToggle = document.createElement('button');
        this.mobileToggle.className = 'mobile-menu-toggle';
        this.mobileToggle.innerHTML = '☰';
        
        Object.assign(this.mobileToggle.style, {
            background: 'none',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm)',
            fontSize: 'var(--font-lg)',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
        });

        this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.appendChild(this.mobileToggle);
        }
    }

    removeMobileToggle() {
        if (this.mobileToggle) {
            this.mobileToggle.remove();
            this.mobileToggle = null;
        }
    }

    toggleMobileMenu() {
        this.nav.classList.toggle('mobile-open');
        
        if (this.nav.classList.contains('mobile-open')) {
            Object.assign(this.nav.style, {
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderTop: 'none',
                padding: 'var(--space-lg)'
            });
        } else {
            this.nav.style = '';
        }
    }
}

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new ViewToggle();
    new SearchManager();
    new SmoothScroll();
    new FormManager();
    new LazyLoader();
    new ReadingProgress();
    new LoadMore();
    new MobileMenu();

    // Add loading animation end
    document.body.classList.add('loaded');
});

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        ViewToggle,
        SearchManager,
        FormManager,
        utils
    };
}
