function filterProjects() {
  const activeFilters = document.querySelectorAll(".project-filter:not(.filter-disabled)");
  const projects = document.querySelectorAll(".project-container");

  projects.forEach((project) => {
    const tags = Array.from(project.querySelectorAll(".tech-tag")).map((tag) => tag.textContent.toLowerCase());
    const filterMatched = Array.from(activeFilters).every((filter) => tags.includes(filter.textContent.toLowerCase()));
    if (filterMatched || activeFilters.length === 0) {
      project.style.display = "block";
    } else {
      project.style.display = "none";
    }
  });
  calculateVisibleProjects();
}

// Call filterProjects whenever a filter button is clicked
function projectFilterHandler() {
  const projectFilterButtons = document.getElementsByClassName("project-filter");
  Array.from(projectFilterButtons).forEach((filterButton) => {
    filterButton.addEventListener("click", function () {
      this.classList.toggle("filter-disabled");
      filterProjects(); // Update the displayed projects based on the active filters
    });
  });
}

function populateFilterTags() {
  fetch("./data/projects.json")
    .then((response) => response.json())
    .then((jsonResponse) => {
      const platforms = new Set();
      const languages = new Set();
      const frontends = new Set();
      const backends = new Set();
      const tools = new Set();

      // Gather all unique tags
      jsonResponse.projects.forEach((project) => {
        project.tech.platform?.forEach((platform) => platforms.add(platform));
        project.tech.languages?.forEach((language) => languages.add(language));
        project.tech.frontend?.forEach((frontend) => frontends.add(frontend));
        project.tech.backend?.forEach((backend) => backends.add(backend));
        project.tech.tools?.forEach((tool) => tools.add(tool));
      });

      // Function to create and append tag buttons, now includes sorting
      const appendTags = (containerSelector, tags) => {
        const container = document.querySelector(containerSelector);
        const template = document.getElementById("filter-tag-template");
        [...tags].sort().forEach((tag) => {
          // Convert Set to Array and sort
          const clone = template.content.cloneNode(true);
          const button = clone.querySelector("button");
          button.innerText = tag;
          button.classList.add(
            tag.toLowerCase().replaceAll(" ", "-").replaceAll(".", "").replaceAll("#", "sharp") + "-tag"
          );
          container.appendChild(clone);
        });
      };

      // Populate each category
      appendTags(".project-filters-platform", platforms);
      appendTags(".project-filters-language", languages);
      appendTags(".project-filters-frontend", frontends);
      appendTags(".project-filters-backend", backends);
      appendTags(".project-filters-tools", tools);

      // Add event listeners to each tag button
      projectFilterHandler();
    });
}

function disableAllFilterButtons() {
  document.querySelectorAll(".project-filter").forEach((button) => {
    button.classList.add("filter-disabled");
  });
  filterProjects(); // Re-filter projects after updating the button states
}

document.getElementById("select-none-filter").addEventListener("click", disableAllFilterButtons);

populateFilterTags();
addFilteredProjects("all");

function calculateVisibleProjects() {
  const visibleProjects = document.querySelectorAll(".project-container[style='display: block;']");
  const hiddenProjects = document.querySelectorAll(".project-container[style='display: none;']");

  const visibleProjectsText = document.getElementById("visible-projects");
  visibleProjectsText.textContent = `Currently showing ${visibleProjects.length} of ${
    visibleProjects.length + hiddenProjects.length
  } projects. (${hiddenProjects.length} hidden)`;
}

const currentUrl = window.location.href;
