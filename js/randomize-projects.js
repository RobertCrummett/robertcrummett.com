document.addEventListener('DOMContentLoaded', function() {
    const allProjects = [
        {
            title: "Hello World in C",
            description: "A simple C program demonstrating basic syntax.",
            download: "../../assets/code-snippets/hello-world.c",
            github: "https://github.com/RobertCrummett/hello-world.git",
            code: `// hello-world.c
<b>#include</b> &ltstdio.h&gt

int main(int argc, char **argv) {
    printf("Hello, World!\\n");
    return 0;
}`
        },
        {
            title: "Work In Progress",
            description: "Finish this page later.",
            download: "../../assets/code-snippets/in-progress.c",
            github: "https://github.com/RobertCrummett",
            code: `// in-progress.c
<b>#ifndef</b> NDEBUG
<b>#define</b> ASSERT(x) do { if (!(x)) __builtin_trap(); } while (0)
<b>#else</b>
<b>#define</b> ASSERT(x) do { } while (0)
<b>#endif</b> 

int main(void) {
    ASSERT(0 && "TODO: Add my projects to this page.");
    return 0;
}`
        },
    ];

    const PROJECTS_TO_SHOW = 2; // Number of projects to display
    const STORAGE_KEY = 'projectOrder';
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function getProjectOrder() {
        let order = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
        
        if (!order || order.length !== allProjects.length) {
            order = shuffleArray(allProjects.map((_, index) => index));
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
        }
        
        return order;
    }

    function displayProjects() {
        const container = document.getElementById('code-container');
        container.innerHTML = '';
        
        const projectOrder = getProjectOrder();
        const projectsToShow = projectOrder.slice(0, PROJECTS_TO_SHOW).map(i => allProjects[i]);
        
        projectsToShow.forEach((project, index) => {
            const projectHTML = `
                <section class="code-project" style="animation-delay: ${index * 0.15}s">
                    <h2>${project.title}</h2>
                    <p>${project.description}</p>
                    <div class="code-actions">
                        <a href="${project.download}" download="${project.download.split('/').pop()}" class="download-btn">Download Source</a>
                        <a href="${project.github}" target="_blank" class="git-btn">View on GitHub</a>
                    </div>
                    <pre><code class="language-c">${project.code}</code></pre>
                </section>
            `;
            container.insertAdjacentHTML('beforeend', projectHTML);
        });

        if (allProjects.length > PROJECTS_TO_SHOW) {
            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'refresh-btn';
            refreshBtn.textContent = 'Show Different Projects';
            refreshBtn.addEventListener('click', () => {
                sessionStorage.removeItem(STORAGE_KEY);
                displayProjects();
            });
            container.insertAdjacentElement('beforeend', refreshBtn);
        }
    }

    displayProjects();
});
