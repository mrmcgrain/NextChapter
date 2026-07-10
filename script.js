const storageKey = "project-launch-planner";
const projectCollectionKey = "project-launch-planner-projects";

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

const validFeatureTypes = new Set(["required", "stretch"]);
let hasHydrated = false;
let projectStore = loadProjectStore();
let state = getCurrentProject();

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
const projectSwitcher = document.querySelector("#projectSwitcher");

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section));
});

fields.forEach((field) => {
  const input = document.querySelector(`#${field}`);
  input.value = state[field];
  input.addEventListener("input", () => {
    state[field] = input.value.trim();
    updateCurrentProject();
    persistProjectStore();
    render();
  });
});

projectSwitcher.addEventListener("change", switchProject);
document.querySelector("#addFeature").addEventListener("click", addFeature);
document.querySelector("#addPrompt").addEventListener("click", addPrompt);
document.querySelector("#copyReadme").addEventListener("click", copyReadme);
document.querySelector("#savePlan").addEventListener("click", saveState);
document.querySelector("#newProject").addEventListener("click", createProject);
document.querySelector("#duplicateProject").addEventListener("click", duplicateProject);
document.querySelector("#deleteProject").addEventListener("click", deleteProject);
document.querySelector("#resetPlan").addEventListener("click", resetPlan);

render();
hasHydrated = true;

function loadProjectStore() {
  const savedCollection = localStorage.getItem(projectCollectionKey);
  try {
    if (savedCollection) {
      const parsed = JSON.parse(savedCollection);
      if (parsed.projects?.length) {
        return normalizeProjectStore(parsed);
      }
    }
  } catch {
    localStorage.removeItem(projectCollectionKey);
  }

  return createStoreFromLegacyState();
}

function createStoreFromLegacyState() {
  let legacyState = structuredClone(defaultState);

  try {
    const savedLegacyState = localStorage.getItem(storageKey);
    if (savedLegacyState) {
      legacyState = normalizeState(JSON.parse(savedLegacyState));
    }
  } catch {
    localStorage.removeItem(storageKey);
  }

  const project = {
    id: createProjectId(),
    updatedAt: new Date().toISOString(),
    state: legacyState
  };

  return {
    activeProjectId: project.id,
    projects: [project]
  };
}

function normalizeProjectStore(store) {
  const projects = store.projects.map((project) => ({
    id: project.id || createProjectId(),
    updatedAt: project.updatedAt || new Date().toISOString(),
    state: normalizeState(project.state || {})
  }));

  const activeProjectId = projects.some((project) => project.id === store.activeProjectId)
    ? store.activeProjectId
    : projects[0].id;

  return { activeProjectId, projects };
}

function normalizeState(rawState = {}) {
  const source = rawState && typeof rawState === "object" ? rawState : {};
  const normalized = { ...structuredClone(defaultState), ...source };
  normalized.projectName = normalizeText(source.projectName);
  normalized.targetUser = normalizeText(source.targetUser);
  normalized.problem = normalizeText(source.problem);
  normalized.value = normalizeText(source.value);
  normalized.solution = normalizeText(source.solution);
  normalized.mvp = normalizeText(source.mvp);
  normalized.features = Array.isArray(source.features)
    ? source.features.map(normalizeFeature).filter(Boolean)
    : structuredClone(defaultState.features);
  normalized.prompts = Array.isArray(source.prompts)
    ? source.prompts.map(normalizePrompt).filter(Boolean)
    : [];
  normalized.checklist = { ...structuredClone(defaultState.checklist), ...(source.checklist || {}) };
  return normalized;
}

function normalizeText(value) {
  return typeof value === "string" ? value : "";
}

function normalizeFeature(feature) {
  if (!feature || typeof feature !== "object") {
    return null;
  }

  const text = normalizeText(feature.text).trim();
  if (!text) {
    return null;
  }

  return {
    text,
    type: validFeatureTypes.has(feature.type) ? feature.type : "stretch"
  };
}

function normalizePrompt(promptEntry) {
  if (!promptEntry || typeof promptEntry !== "object") {
    return null;
  }

  const prompt = normalizeText(promptEntry.prompt).trim();
  const learning = normalizeText(promptEntry.learning).trim();
  if (!prompt || !learning) {
    return null;
  }

  return {
    category: normalizeText(promptEntry.category) || "Planning",
    prompt,
    learning
  };
}

function getCurrentProject() {
  const project = projectStore.projects.find((item) => item.id === projectStore.activeProjectId);
  return project?.state || structuredClone(defaultState);
}

function getCurrentProjectRecord() {
  return projectStore.projects.find((project) => project.id === projectStore.activeProjectId);
}

function updateCurrentProject() {
  const project = getCurrentProjectRecord();
  if (!project) {
    return;
  }

  project.state = state;
  project.updatedAt = new Date().toISOString();
}

function persistProjectStore() {
  if (!hasHydrated) {
    return;
  }

  localStorage.setItem(projectCollectionKey, JSON.stringify(projectStore));
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function saveState({ showStatus = true } = {}) {
  updateCurrentProject();
  persistProjectStore();
  if (!showStatus) {
    return;
  }

  saveStatus.textContent = "Project saved.";
  setTimeout(() => {
    saveStatus.textContent = "";
  }, 2200);
}

function resetPlan() {
  const confirmed = window.confirm("Clear this project's planner fields?");
  if (!confirmed) {
    return;
  }

  state = structuredClone(defaultState);
  updateCurrentProject();
  persistProjectStore();
  syncFields();
  render();
}

function createProject() {
  updateCurrentProject();
  const project = {
    id: createProjectId(),
    updatedAt: new Date().toISOString(),
    state: structuredClone(defaultState)
  };

  projectStore.projects.push(project);
  projectStore.activeProjectId = project.id;
  state = project.state;
  syncFields();
  saveState();
  render();
  document.querySelector("#projectName").focus();
}

function duplicateProject() {
  updateCurrentProject();
  const duplicatedState = structuredClone(state);
  duplicatedState.projectName = duplicatedState.projectName
    ? `${duplicatedState.projectName} Copy`
    : "Untitled Project Copy";

  const project = {
    id: createProjectId(),
    updatedAt: new Date().toISOString(),
    state: duplicatedState
  };

  projectStore.projects.push(project);
  projectStore.activeProjectId = project.id;
  state = project.state;
  syncFields();
  saveState();
  render();
}

function deleteProject() {
  if (projectStore.projects.length === 1) {
    window.alert("At least one project must remain.");
    return;
  }

  const currentProject = getCurrentProject();
  const projectName = currentProject?.projectName?.trim() || "Untitled Project";
  const confirmed = window.confirm(`Delete "${projectName}"? This cannot be undone.`);
  if (!confirmed) {
    return;
  }

  const currentIndex = projectStore.projects.findIndex((project) => project.id === projectStore.activeProjectId);
  projectStore.projects.splice(currentIndex, 1);
  projectStore.activeProjectId = projectStore.projects[Math.max(0, currentIndex - 1)].id;
  state = getCurrentProject();
  syncFields();
  saveState();
  render();
}

function switchProject() {
  updateCurrentProject();
  projectStore.activeProjectId = projectSwitcher.value;
  state = getCurrentProject();
  syncFields();
  saveState();
  render();
}

function syncFields() {
  fields.forEach((field) => {
    document.querySelector(`#${field}`).value = state[field] || "";
  });
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
  updateCurrentProject();
  persistProjectStore();
  input.value = "";
  render();
}

function removeFeature(index) {
  state.features.splice(index, 1);
  updateCurrentProject();
  persistProjectStore();
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
  updateCurrentProject();
  persistProjectStore();
  document.querySelector("#promptText").value = "";
  document.querySelector("#promptLearning").value = "";
  render();
}

function removePrompt(index) {
  state.prompts.splice(index, 1);
  updateCurrentProject();
  persistProjectStore();
  render();
}

function render() {
  renderProjectSwitcher();
  renderFeatures();
  renderPrompts();
  renderChecklist();
  renderReadme();
  renderReadiness();
}

function renderProjectSwitcher() {
  projectSwitcher.innerHTML = "";

  projectStore.projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = getProjectLabel(project);
    option.selected = project.id === projectStore.activeProjectId;
    projectSwitcher.append(option);
  });
}

function renderFeatures() {
  requiredList.innerHTML = "";
  stretchList.innerHTML = "";

  state.features.forEach((feature, index) => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = feature.text;
    item.append(text);

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
    const category = document.createElement("strong");
    category.textContent = entry.category;

    const prompt = document.createElement("p");
    const promptLabel = document.createElement("b");
    promptLabel.textContent = "Prompt:";
    prompt.append(promptLabel, document.createTextNode(` ${entry.prompt}`));

    const learning = document.createElement("p");
    const learningLabel = document.createElement("b");
    learningLabel.textContent = "What changed:";
    learning.append(learningLabel, document.createTextNode(` ${entry.learning}`));

    item.append(category, prompt, learning);

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
      updateCurrentProject();
      persistProjectStore();
      renderReadiness();
    });

    row.append(input, document.createTextNode(label));
    checklist.append(row);
  });
}

function getProjectLabel(project) {
  const name = project.state.projectName?.trim() || "Untitled Project";
  const updatedAt = new Date(project.updatedAt);
  const dateLabel = Number.isNaN(updatedAt.getTime())
    ? "Not saved"
    : updatedAt.toLocaleDateString();
  return `${name} - ${dateLabel}`;
}

function createProjectId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
