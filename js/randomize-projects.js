document.addEventListener('DOMContentLoaded', function() {
    const allProjects = [
        {
            title: "Hello World in C",
            description: "A simple C program demonstrating basic syntax.",
            download: "code/hello-world.c",
            github: "https://github.com/RobertCrummett/hello-world.git",
            code: `// hello-world.c
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
        },
        {
            title: "File I/O Example",
            description: "Demonstrates reading and writing files in C.",
            download: "code/file-io.c",
            github: "https://github.com/RobertCrummett/file-io.git",
            code: `// file-io.c
#include <stdio.h>

int main() {
    FILE *file = fopen("example.txt", "w");
    fprintf(file, "Writing to a file\\n");
    fclose(file);
    return 0;
}`
        },
        {
            title: "Data Structures",
            description: "Basic linked list implementation in C.",
            download: "code/linked-list.c",
            github: "https://github.com/RobertCrummett/data-structures.git",
            code: `// linked-list.c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

// ... more list functions ...
}`
        },
        {
            title: "Multi-threading",
            description: "Simple pthread example in C.",
            download: "code/threading.c",
            github: "https://github.com/RobertCrummett/threading-example.git",
            code: `// threading.c
#include <stdio.h>
#include <pthread.h>

void* thread_func(void* arg) {
    printf("Hello from thread!\\n");
    return NULL;
}`
        }
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
        const container = document.getElementById('projects-container');
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
/*
document.addEventListener('DOMContentLoaded', function() {
    const projects = [
        {
            title: "Hello World in C",
            description: "A simple C program demonstrating basic syntax.",
            download: "code/hello-world.c",
            github: "https://github.com/RobertCrummett/hello-world.git",
            code: `// hello-world.c
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
        },
        {
            title: "Second Program",
            description: "A second C program demonstrating basic syntax.",
            download: "code/second-program.c",
            github: "https://github.com/RobertCrummett/second-program.git",
            code: `// second-program.c
#include <stdio.h>

int main() {
    printf("This is another program!\\n");
    return 0;
}`
        },
        {
            title: "Third Program",
            description: "Demonstrating more advanced concepts.",
            download: "code/third-program.c",
            github: "https://github.com/RobertCrummett/third-program.git",
            code: `// third-program.c
#include <stdio.h>

void greet() {
    printf("Greetings from C!\\n");
}

int main() {
    greet();
    return 0;
}`
        }
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function displayProjects() {
        const container = document.getElementById('projects-container');
        container.innerHTML = '';
        
        shuffleArray(projects).forEach(project => {
            const projectHTML = `
                <section class="code-project">
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
    }

    displayProjects();
});
*/
