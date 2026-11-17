
function toggleMenu() {
    const menu = document.querySelector(".nav-links");
    menu.classList.toggle("active");
}

// Close menu after clicking a navigation link
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector(".nav-links").classList.remove("active");
    });
});

let visitors = localStorage.getItem("visitorCount");

if (visitors === null) {
    visitors = 1;
} else {
    visitors = Number(visitors) + 1;
}

localStorage.setItem("visitorCount", visitors);

document.getElementById("visitor-count").textContent = visitors;

function showProjects(projectType, clickedButton) {
    document.querySelectorAll('.project-content').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.project-tab').forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(projectType).classList.add('active');

    clickedButton.classList.add('active');
}

