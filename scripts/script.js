const changeSkillDisplayButtons = document.getElementsByClassName("change-skill-display");
for (let button of changeSkillDisplayButtons) {
  button.addEventListener("click", function () {
    // if already active, do nothing
    if (button.classList.contains("change-skill-display-enabled")) {
      return;
    }

    // remove all active classes from buttons
    for (let otherButton of changeSkillDisplayButtons) {
      otherButton.classList.remove("change-skill-display-enabled");
    }

    // add active class to clicked button
    button.classList.add("change-skill-display-enabled");

    // change display of skills depending on button clicked
    const skillsDisplay = document.getElementById("skills-display");
    skillsDisplay.classList.remove("skills-locker-category");
    skillsDisplay.classList.remove("skills-locker-matrix");
    skillsDisplay.classList.remove("skills-locker-tier-list");

    if (button.id === "skill-display-category") {
      skillsDisplay.classList.add("skills-locker-category");
    } else if (button.id === "skill-display-matrix") {
      skillsDisplay.classList.add("skills-locker-matrix");
    } else if (button.id === "skill-display-tiered") {
      skillsDisplay.classList.add("skills-locker-tier-list");
    }
  });
}

function isElementNearMiddle(element, leewayFactor = 0.2) {
  const elementRect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate the middle of the screen
  const middleOfScreen = (windowHeight / 2) * (1 + leewayFactor);

  // Check if the element's top or bottom is near the middle of the screen
  return elementRect.top <= middleOfScreen && elementRect.bottom >= middleOfScreen;
}

function handleScroll() {
  if (window.innerWidth <= 768) {
    let elementInView = null;

    elementsToObserve.forEach((element) => {
      if (isElementNearMiddle(element, 0.05)) {
        elementInView = element;
      }
    });

    // Remove the "hover-effect" class from all elements except the one in view
    elementsToObserve.forEach((element) => {
      if (element !== elementInView) {
        element.classList.remove("hovered");
      }
    });

    // Add the "hover-effect" class to the element in view
    elementInView.classList.add("hovered");
  }
}

window.addEventListener("scroll", handleScroll);

// Initial check on page load
window.addEventListener("load", handleScroll);

let elementsToObserve = document.querySelectorAll(".hoverable");

addFilteredProjects("all", 3);
