document.addEventListener('DOMContentLoaded', () => {
    // Reveal on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };
    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // Sticky Header Scroll Effect
    const header = document.querySelector('.header-main');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // A/B Testing Logic
    let variant = localStorage.getItem('ab_variant');
    if (!variant) {
        variant = Math.random() < 0.5 ? 'A' : 'B'; // A: With Phone, B: No Phone
        localStorage.setItem('ab_variant', variant);
    }

    const phoneGroup = document.getElementById('phone-group');
    const telInput = document.getElementById('tel');

    if (variant === 'B' && phoneGroup && telInput) {
        phoneGroup.style.display = 'none';
        telInput.removeAttribute('required');
    }

    // Lead Capture Modal Logic
    const modal = document.getElementById('leadModal');
    const videoTrigger = document.getElementById('videoTrigger');
    const heroTrigger = document.getElementById('heroTrigger');
    const finalTrigger = document.getElementById('finalTrigger');
    const closeModal = document.getElementById('closeModal');
    const leadForm = document.getElementById('leadForm');

    const openModal = (e) => {
        if (e) e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    const closeLeadModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    videoTrigger?.addEventListener('click', openModal);
    heroTrigger?.addEventListener('click', openModal);
    finalTrigger?.addEventListener('click', openModal);
    closeModal?.addEventListener('click', closeLeadModal);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeLeadModal();
    });

    // Handle Form Submission
    leadForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect lead data
        const leadData = {
            prenom: document.getElementById('prenom').value,
            nom: document.getElementById('nom').value,
            email: document.getElementById('email').value,
            variant: variant // Track the A/B variant
        };

        // Add phone if variant A
        if (variant === 'A') {
            leadData.tel = document.getElementById('tel').value;
        }

        // Send to Webhook
        try {
            fetch('https://n8npp.prcz.fr/webhook/atelier-aura', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leadData)
            });
        } catch (error) {
            console.error('Webhook Error:', error);
        }

        // Transform the video banner into a real player
        const videoContainer = document.getElementById('videoTrigger');
        if (videoContainer) {
            videoContainer.innerHTML = `
                <div style="width:100%; aspect-ratio:16/9; background:#000; display:flex; align-items:center; justify-content:center; color:white; flex-direction:column; gap:10px;">
                    <p style="font-size: 1.25rem;">Bienvenue ${leadData.prenom} ! 🚀</p>
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </div>
            `;
        }

        closeLeadModal();
    });

    // Dynamic Cursor Glow
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Move active cursor glow
        cursorGlow.style.transform = `translate(${mouseX - 100}px, ${mouseY - 100}px)`;

        // Move background halos subtly
        const normX = mouseX / window.innerWidth;
        const normY = mouseY / window.innerHeight;
        const halo1 = document.querySelector('.halo-1');
        const halo2 = document.querySelector('.halo-2');

        if (halo1) {
            halo1.style.transform = `translate(${normX * 60}px, ${normY * 60}px)`;
        }
        if (halo2) {
            halo2.style.transform = `translate(${-normX * 60}px, ${-normY * 60}px)`;
        }
    });

    // Team Section Interactions
    const initTeamSection = () => {
        const cards = document.querySelectorAll('.member-card-wrapper');

        cards.forEach((card) => {
            // Flip Logic
            const btnMore = card.querySelector('.btn-more');
            const btnBack = card.querySelector('.btn-back');
            const btnClose = card.querySelector('.close-back');

            const toggleFlip = (e) => {
                e.stopPropagation();
                card.classList.toggle('flipped');
            };

            btnMore?.addEventListener('click', toggleFlip);
            btnBack?.addEventListener('click', toggleFlip);
            btnClose?.addEventListener('click', toggleFlip);

            // Toggle on whole card for mobile or simpler interaction
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    toggleFlip(e);
                }
            });
        });
    };

    initTeamSection();
});
