// Scroll
document.addEventListener('wheel', (event) => {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.scrollY;
    const viewportHeight = window.innerHeight;

    let nextSection;
    if (event.deltaY > 0) {
        // Scrolling down
        nextSection = Array.from(sections).find(
            (section) => section.offsetTop > currentScroll + viewportHeight * 0.5
        );
    } else {
        // Scrolling up
        nextSection = Array.from(sections)
            .reverse()
            .find((section) => section.offsetTop < currentScroll - viewportHeight * 0.5);
    }

    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, null, `#${nextSection.id}`);
    }
});

document.querySelectorAll('.navbar a').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, null, `#${targetId}`);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Now Playing
    const nowPlaying = document.getElementById('now-playing');

    nowPlaying.style.opacity = 0;
    nowPlaying.style.transition = 'opacity 1s ease-in';

    setTimeout(() => {
        nowPlaying.style.opacity = 1;
    }, 7500);

    // Navbar
    const commandText = document.getElementById('command-text');
    const fullText = '$ cd /home/ ';
    let index = 0;

    function typeCommand() {
        if (index < fullText.length) {
            commandText.innerHTML += fullText.charAt(index);
            index++;
            setTimeout(typeCommand, 150);
        }
    }

    typeCommand();

    // Bio
    const bioTextElement = document.getElementById('bio-text');

    const messages = [
        'See you in the future', // Inglés
        'À bientôt dans le futur', // Francés
        'Ci vediamo nel futuro', // Italiano
        'Vi ses i framtiden', // Sueco
        'Wir sehen uns in der Zukunft', // Alemán
        'Te veo en el futuro', // Portugués
        '未来で会いましょう', // Japonés
        '未来で会いましょう', // Chino
        'Нам предстоит увидеться в будущем', // Ruso
        'Nos encontraremos no futuro', // Portugués de Brasil
        'Vi vil mødes i fremtiden', // Danés
        'Nos vemos en el futuro' // Español
    ];

    function getRandomIndex(excludeIndex) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * messages.length);
        } while (randomIndex === excludeIndex);
        return randomIndex;
    }

    let currentIndex = null;

    function changeBioText() {
        bioTextElement.style.opacity = 0;

        setTimeout(() => {
            const newIndex = getRandomIndex(currentIndex);
            bioTextElement.textContent = messages[newIndex];
            bioTextElement.style.opacity = 1;
            currentIndex = newIndex;
        }, 500);
    }

    setInterval(changeBioText, 3000);

    // Noise
    const sections = document.querySelectorAll('section');
    const backgrounds = document.querySelectorAll('.background');

    function adjustOpacity() {
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const visiblePercentage = Math.max(
                0,
                Math.min(1, (window.innerHeight - rect.top) / rect.height)
            );
            if (visiblePercentage > 0) {
                backgrounds[index].style.opacity = 0.2 + visiblePercentage * 0.15;
            } else {
                backgrounds[index].style.opacity = 0;
            }
        });
    }

    window.addEventListener('scroll', adjustOpacity);
    adjustOpacity();
});

// Socials
fetch('./socials.json')
    .then((response) => response.json())
    .then((data) => {
        const socialsContainer = document.getElementById('socials-container');
        data.forEach((social) => {
            const slug = social.slug ?? social.name.toLowerCase();
            const logo = social.icon ?? social.name.toLowerCase();
            const name = social.name;

            const button = document.createElement('a');
            button.classList.add('button', `button-${slug}`);
            button.href = `https://${social.url}`;
            button.target = '_blank';
            button.rel = 'noopener';
            button.role = 'button';
            button.dataset.umamiEvent = `social-${social.name.toLowerCase()}`;
            button.innerHTML = `<img src="https://cdn.statically.io/gh/sethcottle/littlelink/main/images/icons/${logo}.svg" alt="${name} Logo" />${name}`;
            socialsContainer.appendChild(button);
        });
    });

// Projects
fetch('./projects.json')
    .then((response) => response.json())
    .then((data) => {
        const projectsContainer = document.getElementById('projects-container');
        data.forEach((project) => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
				<img src="https://${project.image}" alt="${project.title} Image" />
				<h2>${project.title}</h2>
				<p>${project.description}</p>
				<div class="project-links">
					${project.links
                    .map(
                        (link) =>
                            `<a href="https://${link.url}" data-umami-event="project-${link.name.toLowerCase()}-${project.title.toLowerCase().replace(' ', '_')}" target="_blank"><img src="https://cdn.statically.io/gh/sethcottle/littlelink/main/images/icons/${link.slug}.svg" alt="${link.name}" /> ${link.name}</a>`
                    )
                    .join('')}
				</div>
			`;
            projectsContainer.appendChild(projectCard);
        });
    });
