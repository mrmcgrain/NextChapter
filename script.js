const storageKey = "project-launch-planner";

const defaultState = {
  projectName: "",
  targetUser: "",
  problem: "",
  value: "",
  solution: "",
  mvp: "",
  features: [
    { text: "Create a guided project planning form", type: "required" },
    { text: "Generate a README draft from the plan", type: "required" },
    { text: "Track selected AI prompts and lessons learned", type: "required" },
    { text: "Export project files as a downloadable package", type: "stretch" }
  ],
  prompts: [],
  checklist: {
    repo: false,
    pages: false,
    app: false,
    readme: false,
    promptHistory: false,
    commits: false,
    structure: false,
    value: false,
    explain: false
  }
};

let state = loadState();

const fields = ["projectName", "targetUser", "problem", "value", "solution", "mvp"];
const checklistItems = [
  ["repo", "Public GitHub repository"],
  ["pages", "Working GitHub Pages deployment link"],
  ["app", "Working application"],
  ["readme", "README with required sections"],
  ["promptHistory", "Prompt history included"],
  ["commits", "Multiple meaningful commits"],
  ["structure", "Clear project structure"],
  ["value", "Features that demonstrate value"],
  ["explain", "Code you can explain"]
];

const readinessScore = document.querySelector("#readinessScore");
const readinessMessage = document.querySelector("#readinessMessage");
const readmeOutput = document.querySelector("#readmeOutput");
const requiredList = document.querySelector("#requiredList");
const stretchList = document.querySelector("#stretchList");
const promptList = document.querySelector("#promptList");
const checklist = document.querySelector("#checklist");
const saveStatus = document.querySelector("#saveStatus");

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section));
});

fields.forEach((field) => {
  const input = document.querySelector(`#${field}`);
  input.value = state[field];
  input.addEventListener("input", () => {
    state[field] = input.value.trim();
    render();
  });
});

document.querySelector("#addFeature").addEventListener("click", addFeature);
document.querySelector("#addPrompt").addEventListener("click", addPrompt);
document.querySelector("#copyReadme").addEventListener("click", copyReadme);
document.querySelector("#savePlan").addEventListener("click", saveState);
document.querySelector("#resetPlan").addEventListener("click", resetPlan);

render();

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return structuredClone(defaultState);
  }

  try {
    return { ...structuredClone(defaultState), ...JSON.parse(saved) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  saveStatus.textContent = "Saved locally.";
  setTimeout(() => {
    saveStatus.textContent = "";
  }, 2200);
}

function resetPlan() {
  const confirmed = window.confirm("Clear the planner and remove saved browser data?");
  if (!confirmed) {
    return;
  }

  state = structuredClone(defaultState);
  localStorage.removeItem(storageKey);
  fields.forEach((field) => {
    document.querySelector(`#${field}`).value = state[field];
  });
  render();
}

function showSection(sectionId) {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });

  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });
}

function addFeature() {
  const input = document.querySelector("#featureText");
  const type = document.querySelector("#featureType").value;
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  state.features.push({ text, type });
  input.value = "";
  render();
}

function removeFeature(index) {
  state.features.splice(index, 1);
  render();
}

function addPrompt() {
  const category = document.querySelector("#promptCategory").value;
  const prompt = document.querySelector("#promptText").value.trim();
  const learning = document.querySelector("#promptLearning").value.trim();

  if (!prompt || !learning) {
    return;
  }

  state.prompts.push({ category, prompt, learning });
  document.querySelector("#promptText").value = "";
  document.querySelector("#promptLearning").value = "";
  render();
}

function removePrompt(index) {
  state.prompts.splice(index, 1);
  render();
}

function render() {
  renderFeatures();
  renderPrompts();
  renderChecklist();
  renderReadme();
  renderReadiness();
}

function renderFeatures() {
  requiredList.innerHTML = "";
  stretchList.innerHTML = "";

  state.features.forEach((feature, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${escapeHtml(feature.text)}</span>`;

    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeFeature(index));
    item.append(remove);

    if (feature.type === "required") {
      requiredList.append(item);
    } else {
      stretchList.append(item);
    }
  });
}

function renderPrompts() {
  promptList.innerHTML = "";

  state.prompts.forEach((entry, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${escapeHtml(entry.category)}</strong>
      <p><b>Prompt:</b> ${escapeHtml(entry.prompt)}</p>
      <p><b>What changed:</b> ${escapeHtml(entry.learning)}</p>
    `;

    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removePrompt(index));
    item.append(remove);
    promptList.append(item);
  });
}

function renderChecklist() {
  checklist.innerHTML = "";

  checklistItems.forEach(([key, label]) => {
    const row = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(state.checklist[key]);
    input.addEventListener("change", () => {
      state.checklist[key] = input.checked;
      renderReadiness();
    });

    row.append(input, document.createTextNode(label));
    checklist.append(row);
  });
}

function renderReadme() {
  readmeOutput.textContent = buildReadme();
}

function renderReadiness() {
  const planFields = fields.filter((field) => state[field]).length;
  const hasRequired = state.features.some((feature) => feature.type === "required");
  const hasStretch = state.features.some((feature) => feature.type === "stretch");
  const promptReady = state.prompts.length > 0;
  const checked = Object.values(state.checklist).filter(Boolean).length;
  const total = fields.length + 4 + checklistItems.length;
  const complete = planFields + Number(hasRequired) + Number(hasStretch) + Number(promptReady) + checked + 1;
  const score = Math.round((complete / total) * 100);

  readinessScore.textContent = `${score}%`;
  readinessMessage.textContent = score >= 85
    ? "Ready for final review."
    : score >= 50
      ? "Good progress. Finish the missing sections."
      : "Start by defining the problem.";
}

function buildReadme() {
  const projectName = state.projectName || "Project Name";
  const required = state.features
    .filter((feature) => feature.type === "required")
    .map((feature) => `- ${feature.text}`)
    .join("\n") || "- Add completed feature";
  const stretch = state.features
    .filter((feature) => feature.type === "stretch")
    .map((feature) => `- ${feature.text}`)
    .join("\n") || "- Add future improvement";

  return `# ${projectName}

## Live Demo

[View the live project](your-github-pages-link)

## Problem

${state.problem || "Describe the specific problem your project solves."}

## User

${state.targetUser || "Identify the person or group who has this problem."}

## Value

${state.value || "Explain the benefit the user receives."}

## Project Plan

Solution: ${state.solution || "Describe how the application helps."}

Smallest demonstration of value: ${state.mvp || "Describe the simplest useful version of the application."}

## Features

### Completed

${required}

### Future Improvements

${stretch}

## Technologies Used

- HTML
- CSS
- JavaScript

## AI Tools Used

AI was used to support planning, feature design, code generation, debugging, verification, and documentation. The project decisions were reviewed against the original problem and smallest useful version.

## Running the Project

1. Clone or download the repository.
2. Open \`index.html\` in a web browser.
3. Fill out the planner, save progress in the browser, and use the README draft as project documentation.`;
}

async function copyReadme() {
  await navigator.clipboard.writeText(buildReadme());
  saveStatus.textContent = "README draft copied.";
  setTimeout(() => {
    saveStatus.textContent = "";
  }, 2200);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
