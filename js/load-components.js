document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        fetch('components/nav.html').then(res => res.text()),
        fetch('components/footer.html').then(res => res.text())
    ]).then(([navHTML, footerHTML]) => {
            document.body.insertAdjacentHTML('afterbegin', navHTML);
            document.body.insertAdjacentHTML('beforeend', footerHTML);

            highlightActiveLinks('.navbar a');
            highlightActiveLinks('.footer-nav a');
        });

    function highlightActiveLinks(selector) {
        const links = document.querySelectorAll(selector);
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        links.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
});
