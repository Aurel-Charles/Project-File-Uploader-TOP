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

// Sélecteur de fichier : affiche le nom du fichier choisi
document.querySelectorAll('.file-picker').forEach(picker => {
    const input = picker.querySelector('input[type="file"]');
    const label = picker.querySelector('.file-picker-name');
    const placeholder = label.textContent;

    input.addEventListener('change', () => {
        const file = input.files[0];
        label.textContent = file ? file.name : placeholder;
        picker.title = file ? file.name : '';
        picker.classList.toggle('has-file', Boolean(file));
    });
});
