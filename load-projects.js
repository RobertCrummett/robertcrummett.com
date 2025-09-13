document.addEventListener('DOMContentLoaded', function() {
	const projects = [
		{
			id: 'dcip-aegc-2025',
			title: 'Optimized Ergodic Data Acquisition for Accelerated Gradient Array DCIP Surveys',
			conference: 'Australiasian Exploration Geoscience Conference 2025',
			type: 'Presentation',
			dziPath: './assets/presentations/dcip-aegc-2025.dzi',
			pdfPath: './assets/presentations/dcip-aegc-2025.pdf'
		},
		{
			id: 'radiometrics-aegc-2025',
			title: 'Isometric Log Ratio Transform Analogues to Ternary Diagrams for Regional Scale Mineral Exploration',
			conference: 'Australiasian Exploration Geoscience Conference 2025',
			type: 'Presentation',
			dziPath: './assets/presentations/radiometrics-aegc-2025.dzi',
			pdfPath: './assets/presentations/radiometrics-aegc-2025.pdf'
		},
		{
			id: 'radiometrics-image-2025',
			title: 'Revisiting Radiometric Ratios: Isometric Log Ratio Transforms to Balance Potassium, Thorium, and Uranium Ratios in Regional-Scale Mineral Exploration',
			conference: 'International Meeting for Applied Geosciences & Energy 2025',
			type: 'Low Resolution Poster',
			dziPath: './assets/posters/radiometrics-image-2025.dzi',
			pdfPath: './assets/posters/radiometrics-image-2025.pdf'
		},
		{
			id: 'magnetics-ame-2025',
			title: 'Reformulation of Reduction-to-Pole by Reduction-to-Equator Operators',
			conference: 'Association for Mineral Exploration, Roundup 2025',
			type: 'Low Resolution Poster',
			dziPath: './assets/posters/magnetics-ame-2025.dzi',
			pdfPath: './assets/posters/magnetics-ame-2025.pdf'
		}
	];

	const main = document.querySelector('main');

	const existingPoster = main.querySelector('.poster-container');
	if (existingPoster) {
		existingPoster.remove();
	}

	projects.forEach((project, index) => {
		const projectContainer = document.createElement('section');
		projectContainer.className = 'project-container';

		projectContainer.style.animationDelay = `${index * 0.1}s`;

		projectContainer.innerHTML = `
	    <div class="project-meta">
		<h2 class="project-title">${project.title}</h2>
		<p class="project-conference">${project.conference}</p>
	    </div>

	    <div id="${project.id}-viewer" class="project-viewer"></div>

	    <div class="project-btn-container">
		<a href="${project.pdfPath}" class="project-btn download-btn" download>
		    Download ${project.type} (PDF)
		</a>
	    </div>
	`;

		main.appendChild(projectContainer);

		if (window.OpenSeadragon) {
			OpenSeadragon({
				id: `${project.id}-viewer`,
				prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.0.0/images/",
				tileSources: project.dziPath,
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
