const techTagColors = {
  desktop: "#cc97f9",
  "c#": "#a179dc",
  ".net": "#512bd4",
  web: "#f26529",
  html: "#e44d25",
  cpp: "#659ad2",
  net: "#512bd4",
  "net-framework": "#039dde",
  "win-services": "#c6feff",
  mobile: "#5fc9f9",
  flutter: "#31b9f6",
  dart: "#00d2b8",
  android: "#85c808",
  web: "#f26529",
  html: "#e44d25",
  css: "#2965f1",
  javascript: "#f0db4f",
  typescript: "#0079ca",
  react: "#00d8ff",
  server: "#57ae48",
  "spring boot": "#60b831",
  java: "#5382a2",
  sql: "#dc7433",
  postgresql: "#336791",
  "sql server": "#dc2b27",
  nodejs: "#73aa63",
  docker: "#1d63ed",
  mongodb: "#429933",
  other: "#cccccc",
  unity: "#a6a6a6",
  blender: "#ea7600",
  data: "#ffe160",
  python: "#3c79a9",
  json: "#a1a1a1",
  xml: "#feb543",
  tools: "#6276e9",
  lua: "#000080",
  "visual studio": "#a577db",
  "visual studio code": "#3daaf2",
  "intellij idea": "#e3396f",
  "android studio": "#92c755",
  github: "#7a7a7a",
  gitlab: "#fc6d26",
  git: "#f05033",
  svn: "#809cc9",
  jira: "#2684ff",
  design: "#fe315d",
  photoshop: "#31a8ff",
  premiere: "#9999ff",
  "after effects": "#9999ff",
  vegas: "#1195cf",
  "google sheets": "rgba(29, 166, 102)",
  wpf: "rgba(10, 125, 180)",
  "github pages": "rgba(67, 128, 180, 255)",
};

document.addEventListener("DOMContentLoaded", function () {
  fetch("data/projects.json")
    .then((response) => response.json())
    .then((json) => {
      const categories = ["platform", "languages", "frontend", "backend", "tools"];
      const techCounts = {};

      // Initialize counters for each category
      categories.forEach((category) => {
        techCounts[category] = {};
      });

      // Count occurrences of each tech in each category
      json.projects.forEach((project) => {
        categories.forEach((category) => {
          const techList = project.tech[category] || [];
          techList.forEach((tech) => {
            techCounts[category][tech] = (techCounts[category][tech] || 0) + 1;
          });
        });
      });

      // Generate pie charts for each category
      categories.forEach((category) => {
        const data = techCounts[category];
        const entries = Object.entries(data).map(([key, value]) => ({ key, value }));
        if (entries.length > 0) {
          createPieChart(`#${category}-chart`, entries, category);
        }
      });
    });
});

function createPieChart(selector, data, category) {
  const width = 150,
    height = 150,
    margin = 12;
  const radius = Math.min(width, height) / 2 - margin;
  //const color = d3.scaleOrdinal(d3.schemeCategory10);
  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.key)) // Extract tech tags from data
    .range(data.map((d) => techTagColors[d.key.toLowerCase()] || "#defaultColor")); // Map to colors, with fallback

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie().value((d) => d.value);
  const data_ready = pie(data);

  const arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8);
  const outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  svg
    .selectAll("path")
    .data(data_ready)
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.key));

  svg
    .selectAll("polyline")
    .data(data_ready)
    .join("polyline")
    .attr("stroke", "whitesmoke")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr("points", (d) => {
      const posA = arc.centroid(d);
      const posB = outerArc.centroid(d);
      const posC = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
      return [posA, posB, posC];
    });

  svg
    .selectAll("text")
    .data(data_ready)
    .join("text")
    .text((d) => `${d.data.key}: ${d.data.value}`)
    .attr("transform", (d) => {
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * (midangle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .style("text-anchor", (d) => {
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    })
    .style("fill", "whitesmoke")
    .style("font-family", "Arial")
    .style("font-size", "14px");
}

const coll = document.getElementsByClassName("collapsible");
let i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    //var content = this.nextElementSibling;
    const content = document.getElementById("project-charts-collapsed");
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}
