lucide.createIcons();

const shareBtn = document.querySelectorAll('[data-share]');

shareBtn.forEach(btn => {
    const copyIcon = btn.querySelector('.lucide-copy');
    const checkIcon = btn.querySelector('.lucide-check');
    let timer;

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(btn.dataset.share);

            copyIcon.toggleAttribute('hidden', true);
            checkIcon.toggleAttribute('hidden', false);
            btn.setAttribute('aria-label', 'Copied');

            clearTimeout(timer);
            timer = setTimeout(() => {
                copyIcon.toggleAttribute('hidden', false);
                checkIcon.toggleAttribute('hidden', true);
                btn.setAttribute('aria-label', 'Copy link');
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    });
});
