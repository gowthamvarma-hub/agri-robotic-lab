
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

async function loadAgricultureNews() {
    const newsContainer = document.getElementById("agriculture-news");
    if (!newsContainer) return;

    try {
        const response = await fetch("./news.json");

        if (!response.ok) {
            throw new Error("Unable to load news.json");
        }

        const data = await response.json();
        const articles = data.articles || [];

        newsContainer.replaceChildren();

        if (articles.length === 0) {
            newsContainer.textContent = "No agriculture news is available right now.";
            return;
        }

        articles.forEach(article => {
            const card = document.createElement("article");
            card.className = "news-card";

            const content = document.createElement("div");
            content.className = "news-content";

            const heading = document.createElement("h3");
            heading.textContent = article.title;

            const description = document.createElement("p");
            description.textContent = article.summary || "Read the full article from the original publisher.";

            const readMore = document.createElement("a");
            readMore.textContent = "Read More →";
            readMore.href = article.link;
            readMore.target = "_blank";
            readMore.rel = "noopener noreferrer";

            const date = document.createElement("div");
            date.className = "news-date";
            date.textContent = article.published || "Latest News";

            content.append(date, heading, description, readMore);
            card.appendChild(content);
            newsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Agriculture news error:", error);
        newsContainer.textContent =
            "Agriculture news is temporarily unavailable. Please try again later.";
    }
}

loadAgricultureNews();

/* Show watermark only between Home and Visitor Counter */

const watermarkArea = document.querySelector(".watermark-area");
const watermarkBackground = document.querySelector(".watermark-bg");
const homeSection = document.querySelector("#home");
const visitorCounter = document.querySelector(".visitor-counter");

if (
    watermarkArea &&
    watermarkBackground &&
    homeSection &&
    visitorCounter
) {
    function updateWatermark() {
        const areaTop = watermarkArea.getBoundingClientRect().top;
        const areaBottom = visitorCounter.getBoundingClientRect().top;

        const watermarkVisible =
            areaTop < window.innerHeight &&
            areaBottom > 0;

        watermarkBackground.classList.toggle(
            "watermark-visible",
            watermarkVisible
        );
    }

    window.addEventListener("scroll", updateWatermark);
    window.addEventListener("resize", updateWatermark);

    updateWatermark();
}
