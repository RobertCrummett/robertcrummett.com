document.addEventListener('DOMContentLoaded', function() {
    const posters = [
        {
            id: 'ameposter',
            title: 'Reformulation of Reduction-to-Pole by Reduction-to-Equator Operators',
            conference: 'Association for Mineral Exploration, Roundup 2025',
            dziPath: 'posters/ameposter.dzi',
            pdfPath: 'posters/ameposter.pdf'
        }
    ];

    const main = document.querySelector('main');
    
    const existingPoster = main.querySelector('.poster-container');
    if (existingPoster) {
        existingPoster.remove();
    }

    posters.forEach((poster, index) => {
        const posterContainer = document.createElement('section');
        posterContainer.className = 'poster-container';
        
        posterContainer.style.animationDelay = `${index * 0.1}s`;
        
        posterContainer.innerHTML = `
            <div class="poster-meta">
                <h2 class="poster-title">${poster.title}</h2>
                <p class="poster-conference">${poster.conference}</p>
            </div>

            <div id="${poster.id}-viewer" class="poster-viewer"></div>

            <div class="poster-btn-container">
                <a href="${poster.pdfPath}" class="poster-btn download-btn" download>
                    Download Full Poster (PDF)
                </a>
            </div>
        `;
        
        main.appendChild(posterContainer);

        if (window.OpenSeadragon) {
            OpenSeadragon({
                id: `${poster.id}-viewer`,
                prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.0.0/images/",
                tileSources: poster.dziPath,
                animationTime: 0.5,
                maxZoomPixelRatio: 10,
                visibilityRatio: 1,
                showNavigator: true,
                showZoomControl: true,
                showHomeControl: true
            });
        }
    });
});

console.log("Hello from gallery!");
