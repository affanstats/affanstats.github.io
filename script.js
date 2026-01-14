document.addEventListener('DOMContentLoaded', async () => {
    // --- Data Fetching & Rendering ---
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();

        // Initialize Lucide icons after rendering
        const initIcons = () => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        };

        renderNavigation(data);
        renderHero(data.profile);
        renderAbout(data.about);
        renderProjects(data.projects);
        renderPublications(data.publications);
        renderMisc(data.misc);
        renderRedirects(data.redirects);
        renderFooter(data.profile, data.socials);
        
        initIcons();
        initObservers();

        // Start Typewriter Effect
        if(data.profile && data.profile.name) {
            typeWriter(data.profile.name, 'typewriter-text', 100);
        }

    } catch (error) {
        console.error('Error loading portfolio data:', error);
        document.body.innerHTML = `<div class="p-10 text-center text-red-500">Error loading content. Please ensure local server is running and data.json exists.</div>`;
    }
});

// --- Typewriter Utility ---
function typeWriter(text, elementId, speed = 100) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Clear initial content just in case
    element.textContent = '';
    
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    // Small delay before starting
    setTimeout(type, 500); 
}

// --- Render Functions ---

function renderNavigation(data) {
    const nav = document.getElementById('navbar');
    const sections = [];
    if(data.about) sections.push({id: 'about', label: 'About'});
    if(data.projects && data.projects.length) sections.push({id: 'projects', label: 'Projects'});
    if(data.publications && data.publications.length) sections.push({id: 'publications', label: 'Publications'});
    if(data.misc && data.misc.length) sections.push({id: 'misc', label: 'Misc'});

    const navContent = `
        <div class="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
            <a href="#" class="text-xl font-bold tracking-tighter hover:text-accent transition-colors">
                ${data.profile.name.split(' ')[0]}<span class="text-accent">.</span>
            </a>
            <ul class="hidden md:flex space-x-8 text-sm font-medium text-secondary">
                ${sections.map(sec => `
                    <li>
                        <a href="#${sec.id}" class="hover:text-primary transition-colors link-underline">
                            ${sec.label}
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    nav.innerHTML = navContent;
}

function renderHero(profile) {
    const container = document.getElementById('hero');
    if (!profile) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center w-full">
            <!-- Text Column -->
            <div class="order-2 md:order-1">
                <h1 class="text-6xl md:text-8xl font-black tracking-tighter leading-tight text-secondary">
                    <span class="text-accent">Hi, I'm</span> <br>
                    <span id="typewriter-text" class="text-primary block mt-2"></span>
                </h1>
                <p class="mt-8 text-xl text-secondary max-w-lg leading-relaxed">
                    ${profile.title} <br>
                    <span class="text-accent/80 text-base">${profile.tagline}</span>
                </p>
            </div>
            
            <!-- Image Column -->
            <div class="order-1 md:order-2 flex justify-center md:justify-end">
                <div class="w-[300px] h-[350px] md:w-[450px] md:h-[550px] relative rounded-2xl overflow-hidden shadow-2xl border border-primary/5 transition-all duration-700 ease-in-out">
                    <img src="${profile.image}" alt="${profile.name}" class="w-full h-full object-cover">
                </div>
            </div>
        </div>
    `;
}

function renderAbout(about) {
    const container = document.getElementById('about');
    if (!about) return;

    container.innerHTML = `
        <div class="hidden md:block col-span-3 sticky top-32 h-fit text-accent text-sm font-mono tracking-widest border-t border-primary/10 pt-4">
            01 / ABOUT
        </div>
        <div class="col-span-12 md:col-span-9 border-t border-primary/10 pt-4">
            <h2 class="text-3xl font-bold mb-8 text-accent">${about.title || 'About'}</h2>
            <div class="prose prose-invert prose-lg text-secondary leading-relaxed">
                ${about.content}
            </div>
        </div>
    `;
}

function renderProjects(projects) {
    const container = document.getElementById('projects');
    if (!projects || projects.length === 0) return;

    const projectsHTML = projects.map(project => `
        <article class="group relative border-b border-primary/10 py-12 hover:bg-primary/5 transition-colors -mx-6 px-6 md:px-0 md:mx-0 md:hover:bg-transparent">
            <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                <h3 class="text-2xl font-bold text-accent group-hover:text-primary transition-colors">
                    <a href="${project.link}" target="_blank" class="focus:outline-none">
                        <span class="absolute inset-0 z-10" aria-hidden="true"></span>
                        ${project.title}
                    </a>
                </h3>
                <div class="flex flex-wrap gap-2">
                    ${project.tags.map(tag => `<span class="px-2 py-1 text-xs border border-primary/10 rounded-full text-secondary">${tag}</span>`).join('')}
                </div>
            </div>
            <p class="mt-4 text-secondary max-w-2xl text-lg">${project.description}</p>
            <div class="mt-4 text-accent transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                View Project &rarr;
            </div>
        </article>
    `).join('');

    container.innerHTML = `
        <div class="hidden md:block col-span-3 sticky top-32 h-fit text-accent text-sm font-mono tracking-widest border-t border-primary/10 pt-4">
            02 / PROJECTS
        </div>
        <div class="col-span-12 md:col-span-9 border-t border-primary/10 pt-4">
            <div class="flex flex-col">
                ${projectsHTML}
            </div>
        </div>
    `;
}

function renderPublications(publications) {
    const container = document.getElementById('publications');
    if (!publications || publications.length === 0) return;

    const pubsHTML = publications.map(pub => `
        <div class="py-6 border-b border-primary/5 flex flex-col md:flex-row gap-4 items-start justify-between">
            <div>
                <h4 class="text-xl font-medium text-accent leading-tight">${pub.title}</h4>
                <div class="mt-2 text-secondary flex items-center gap-2">
                    <span class="text-accent">${pub.venue}</span>
                    <span class="text-primary/20">&bull;</span>
                    <span>${pub.year}</span>
                </div>
            </div>
            <a href="${pub.link}" class="shrink-0 p-2 border border-primary/10 rounded hover:border-accent hover:text-accent transition-colors text-sm">
                PDF
            </a>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="hidden md:block col-span-3 sticky top-32 h-fit text-accent text-sm font-mono tracking-widest border-t border-primary/10 pt-4">
            03 / PUBLICATIONS
        </div>
        <div class="col-span-12 md:col-span-9 border-t border-primary/10 pt-4">
             <div class="flex flex-col">
                ${pubsHTML}
            </div>
        </div>
    `;
}

function renderMisc(misc) {
    const container = document.getElementById('misc');
    if (!misc || misc.length === 0) return;

    const miscHTML = misc.map(category => `
        <div class="mb-12">
            <h3 class="text-lg font-bold text-accent mb-4 uppercase tracking-wider text-xs border-b border-accent/20 pb-2 inline-block">${category.category}</h3>
            <ul class="space-y-3">
                ${category.items.map(item => `
                    <li class="flex items-start gap-3 text-secondary">
                        <span class="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent block shrink-0"></span>
                        <span>${item}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="hidden md:block col-span-3 sticky top-32 h-fit text-accent text-sm font-mono tracking-widest border-t border-primary/10 pt-4">
            04 / MISC
        </div>
        <div class="col-span-12 md:col-span-9 border-t border-primary/10 pt-4 grid md:grid-cols-2 gap-8">
            ${miscHTML}
        </div>
    `;
}

function renderRedirects(redirects) {
    const container = document.getElementById('redirects');
    if (!redirects || redirects.length === 0) return;

    const linksHTML = redirects.map(link => `
        <a href="${link.url}" class="group flex items-center justify-between p-6 border border-primary/10 hover:border-accent/50 hover:bg-primary/5 transition-all duration-300">
            <span class="text-lg font-medium text-accent">${link.label}</span>
            <i data-lucide="arrow-up-right" class="group-hover:text-accent transition-colors"></i>
        </a>
    `).join('');

    container.innerHTML = `
        <div class="hidden md:block col-span-3 sticky top-32 h-fit text-accent text-sm font-mono tracking-widest border-t border-primary/10 pt-4">
            RESOURCES
        </div>
        <div class="col-span-12 md:col-span-9 border-t border-primary/10 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            ${linksHTML}
        </div>
    `;
}

function renderFooter(profile, socials) {
    const footer = document.getElementById('footer');
    
    const contactLinks = socials.map(s => `
        <a href="${s.url}" class="text-secondary hover:text-accent transition-colors flex items-center gap-2" target="_blank" aria-label="${s.platform}">
            <i data-lucide="${s.icon}" class="w-5 h-5"></i>
            <span class="hidden md:inline">${s.platform}</span>
        </a>
    `).join('');

    footer.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
                <h2 class="text-4xl font-bold text-accent mb-2">Get in touch</h2>
                <a href="${socials.find(s => s.platform === 'Email')?.url || '#'}" class="text-xl text-accent hover:text-primary transition-colors underline decoration-1 underline-offset-4">
                    ${socials.find(s => s.platform === 'Email')?.url.replace('mailto:', '') || 'Email Me'}
                </a>
            </div>
            <div class="flex gap-6">
                ${contactLinks}
            </div>
        </div>
        <div class="mt-12 pt-8 border-t border-primary/5 flex justify-between text-xs text-primary/30 uppercase tracking-widest">
            <span>&copy; ${new Date().getFullYear()} ${profile.name}</span>
            <span>Designed by Copilot</span>
        </div>
    `;
}

// --- Observers ---

function initObservers() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once loaded
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });
}
