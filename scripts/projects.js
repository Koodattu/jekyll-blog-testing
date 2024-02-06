function addFilteredProjects(filter, limit = 0) {
  fetch("./data/projects.json")
    .then((response) => response.json())
    .then((jsonResponse) => {
      var count = 0;
      const projects = jsonResponse.projects;
      for (let project of projects) {
        count++;
        if (limit > 0 && count > limit) {
          break;
        }
        const projectTemplate = document.getElementById("project-template");
        const projectClone = projectTemplate.content.cloneNode(true);

        const projectContainer = projectClone.querySelector(".project-container");
        projectContainer.href = project.link;

        const projectImageElement = projectClone.querySelector("#project-image");
        projectImageElement.src = "./images/" + project.title.toLowerCase().replaceAll(" ", "-") + ".webp";
        projectImageElement.alt = project.title;

        const projectTitleElement = projectClone.querySelector("#project-title");
        projectTitleElement.innerText = project.title;

        const projectYearElement = projectClone.querySelector("#project-year");
        projectYearElement.innerText = project.year;

        const projectDescriptionElement = projectClone.querySelector("#project-description");
        projectDescriptionElement.innerText = project.description; // Fixed to use description

        const projectTagsElement = projectClone.querySelector("#project-tags");
        const tagTemplate = projectClone.querySelector("#tag-template");
        Object.keys(project.tech).forEach((category) => {
          // Iterate through each category
          project.tech[category].forEach((tag) => {
            // Iterate through tags in each category
            const tagClone = tagTemplate.content.cloneNode(true);
            const tagSpan = tagClone.querySelector("span");
            tagSpan.innerText = tag;
            tagSpan.classList.add(
              tag.toLowerCase().replaceAll(" ", "-").replaceAll(".", "").replaceAll("#", "sharp") + "-tag"
            );
            projectTagsElement.appendChild(tagClone);
          });
        });

        const projectFeaturesElement = projectClone.querySelector("#project-features");
        for (let feature of project.features) {
          const featureElement = document.createElement("li");
          featureElement.innerText = feature;
          projectFeaturesElement.appendChild(featureElement);
        }

        const projectsContainer = document.getElementById("filtered-projects");
        filter = filter.charAt(0).toUpperCase() + filter.slice(1);
        // Assuming filter logic needs adjustment for new structure. Simplified as an example.
        if (filter === "All" || Object.values(project.tech).flat().includes(filter)) {
          projectsContainer.appendChild(projectClone);
        }
      }
      elementsToObserve = document.querySelectorAll(".hoverable"); // Assuming this is used elsewhere
    });
}
