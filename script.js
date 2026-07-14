const storageKey = "project-launch-planner";
const projectCollectionKey = "project-launch-planner-projects";

// Default planner content seeds new projects and restores missing saved fields safely.
const defaultState = {
  projectName: "Project Launch Planner",
  targetUser: "Students building a first software project",
  problem: "Students building a first software project often have the assignment requirements, but not a clear path for turning those requirements into a focused application, complete documentation, and a submission-ready checklist.",
  value: "Project Launch Planner helps a student make stronger decisions before writing or submitting code. It guides them through the problem, user, value, smallest useful version, required features, future features, README draft, prompt history, and submission checklist.",
  solution: "A browser-based planner that saves a project idea, separates required and future features, generates a README draft, tracks meaningful AI prompts, and measures submission readiness.",
  mvp: "The smallest demonstration of value is a static HTML, CSS, and JavaScript application that can run locally or on GitHub Pages without a build step.",
  features: [
    { text: "Create a guided project planning form", type: "required" },
    { text: "Generate a README draft from the plan", type: "required" },
    { text: "Track selected AI prompts and lessons learned", type: "required" },
    { text: "Export project files as a downloadable package", type: "stretch" }
  ],
  prompts: buildDefaultPromptHistory(), // Defined line 622: seeds new browsers with the project prompt history.
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

const validFeatureTypes = new Set(["required", "stretch"]); // Built-in API: creates the allowed feature-type lookup.
let hasHydrated = false;
let projectStore = loadProjectStore(); // Defined line 91: initializes saved projects from browser storage.
let state = getCurrentProject(); // Defined line 205: loads the active project state into memory.

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

const readinessScore = document.querySelector("#readinessScore"); // Browser API: finds the score display.
const readinessMessage = document.querySelector("#readinessMessage"); // Browser API: finds the readiness message display.
const readmeOutput = document.querySelector("#readmeOutput"); // Browser API: finds the README output panel.
const requiredList = document.querySelector("#requiredList"); // Browser API: finds the required-features list.
const stretchList = document.querySelector("#stretchList"); // Browser API: finds the future-improvements list.
const promptList = document.querySelector("#promptList"); // Browser API: finds the saved prompt timeline.
const checklist = document.querySelector("#checklist"); // Browser API: finds the readiness checklist container.
const saveStatus = document.querySelector("#saveStatus"); // Browser API: finds the save feedback status area.
const projectSwitcher = document.querySelector("#projectSwitcher"); // Browser API: finds the saved-project dropdown.

// Section navigation switches between the five planner views without leaving the page.
document.querySelectorAll(".nav-button").forEach((button) => { // Browser API: attaches setup logic to every sidebar navigation button.
  button.addEventListener("click", () => showSection(button.dataset.section)); // Defined line 342: calls showSection when a nav button is clicked.
});

// Project definition inputs autosave into the active project and update generated outputs.
fields.forEach((field) => { // Built-in API: attaches input handlers to every planner field.
  const input = document.querySelector(`#${field}`); // Browser API: finds the form input that matches the current state field.
  input.value = state[field];
  input.addEventListener("input", () => { // Browser API: reacts when the user edits a project definition field.
    state[field] = input.value.trim(); // Built-in API: trims the typed field value before saving it.
    updateCurrentProject(); // Defined line 214: syncs the edited field into the active project record.
    persistProjectStore(); // Defined line 225: saves the edited project to localStorage.
    render(); // Defined line 405: refreshes generated output after the field change.
  });
});

projectSwitcher.addEventListener("change", switchProject); // Defined line 326: calls switchProject when a saved project is selected.
document.querySelector("#addFeature").addEventListener("click", addFeature); // Defined line 353: calls addFeature from the Add feature button.
document.querySelector("#addPrompt").addEventListener("click", addPrompt); // Defined line 378: calls addPrompt from the Save Prompt button.
document.querySelector("#copyReadme").addEventListener("click", copyReadme); // Defined line 614: calls copyReadme from the copy button.
document.querySelector("#savePlan").addEventListener("click", saveState); // Defined line 235: calls saveState from the footer save button.
document.querySelector("#newProject").addEventListener("click", createProject); // Defined line 263: calls createProject from the New button.
document.querySelector("#duplicateProject").addEventListener("click", duplicateProject); // Defined line 281: calls duplicateProject from the Duplicate button.
document.querySelector("#deleteProject").addEventListener("click", deleteProject); // Defined line 303: calls deleteProject from the Delete button.
document.querySelector("#resetPlan").addEventListener("click", resetPlan); // Defined line 249: calls resetPlan from the Clear Planner button.

render(); // Defined line 405: draws the initial UI from loaded state.
hasHydrated = true;

// Saved-project storage loads the multi-project collection and falls back to older single-project data.
function loadProjectStore() { // Line 91: loads saved project data from localStorage.
  const savedCollection = localStorage.getItem(projectCollectionKey); // Browser API: reads the saved project collection.
  try {
    if (savedCollection) {
      const parsed = JSON.parse(savedCollection); // Built-in API: parses the saved project collection JSON.
      if (parsed.projects?.length) {
        return normalizeProjectStore(parsed); // Defined line 131: validates the parsed project collection before use.
      }
    }
  } catch {
    localStorage.removeItem(projectCollectionKey); // Browser API: removes invalid collection data so the app can recover.
  }

  return createStoreFromLegacyState(); // Defined line 107: falls back to older single-project storage.
}

function createStoreFromLegacyState() { // Line 107: migrates older single-project saved data into the project collection.
  let legacyState = structuredClone(defaultState); // Built-in API: creates a clean default state for legacy migration.

  try {
    const savedLegacyState = localStorage.getItem(storageKey); // Browser API: reads older single-project localStorage data.
    if (savedLegacyState) {
      legacyState = normalizeState(JSON.parse(savedLegacyState)); // Defined line 145: parses and validates the older saved state.
    }
  } catch {
    localStorage.removeItem(storageKey); // Browser API: removes invalid legacy data so migration can continue.
  }

  const project = {
    id: createProjectId(), // Defined line 519: assigns a unique ID to the migrated project.
    updatedAt: new Date().toISOString(), // Built-in API: stamps the migrated project with the current save time.
    state: legacyState
  };

  return {
    activeProjectId: project.id,
    projects: [project]
  };
}

function normalizeProjectStore(store) { // Line 131: repairs saved project collection data before the app uses it.
  const projects = store.projects.map((project) => ({ // Built-in API: normalizes every saved project record.
    id: project.id || createProjectId(), // Defined line 519: fills in missing project IDs.
    updatedAt: project.updatedAt || new Date().toISOString(), // Built-in API: fills in missing update timestamps.
    state: normalizeState(project.state || {}) // Defined line 145: validates each saved project's planner state.
  }));

  const activeProjectId = projects.some((project) => project.id === store.activeProjectId) // Built-in API: checks whether the saved active project still exists.
    ? store.activeProjectId
    : projects[0].id;

  return { activeProjectId, projects };
}

function normalizeState(rawState = {}) { // Line 145: fills missing planner fields and validates saved state shape.
  const source = rawState && typeof rawState === "object" ? rawState : {};
  const normalized = { ...structuredClone(defaultState), ...source }; // Built-in API: starts with default state before applying saved values.
  normalized.projectName = normalizeText(source.projectName); // Defined line 165: sanitizes saved project name text.
  normalized.targetUser = normalizeText(source.targetUser); // Defined line 165: sanitizes saved target user text.
  normalized.problem = normalizeText(source.problem); // Defined line 165: sanitizes saved problem text.
  normalized.value = normalizeText(source.value); // Defined line 165: sanitizes saved value text.
  normalized.solution = normalizeText(source.solution); // Defined line 165: sanitizes saved solution text.
  normalized.mvp = normalizeText(source.mvp); // Defined line 165: sanitizes saved MVP text.
  normalized.features = Array.isArray(source.features) // Built-in API: checks that saved features are an array before using them.
    ? source.features.map(normalizeFeature).filter(Boolean) // Defined line 169: validates feature entries, then filters invalid results.
    : structuredClone(defaultState.features); // Built-in API: restores default starter features when saved data is invalid.
  normalized.prompts = Array.isArray(source.prompts) // Built-in API: checks that saved prompts are an array before using them.
    ? source.prompts.map(normalizePrompt).filter(Boolean) // Defined line 185: validates prompt entries, then filters invalid results.
    : [];
  normalized.checklist = { ...structuredClone(defaultState.checklist), ...(source.checklist || {}) }; // Built-in API: merges saved checklist flags over defaults.
  return normalized;
}

// User-controlled saved data is normalized before rendering so bad stored shapes cannot break the UI.
function normalizeText(value) { // Line 165: converts non-string values into safe empty text.
  return typeof value === "string" ? value : "";
}

function normalizeFeature(feature) { // Line 169: validates a saved feature entry and its required/future type.
  if (!feature || typeof feature !== "object") {
    return null;
  }

  const text = normalizeText(feature.text).trim(); // Defined line 165: sanitizes feature text, then trims it with a built-in string method.
  if (!text) {
    return null;
  }

  return {
    text,
    type: validFeatureTypes.has(feature.type) ? feature.type : "stretch" // Built-in API: validates the saved feature type.
  };
}

function normalizePrompt(promptEntry) { // Line 185: validates a saved prompt-history entry.
  if (!promptEntry || typeof promptEntry !== "object") {
    return null;
  }

  const prompt = normalizeText(promptEntry.prompt).trim(); // Defined line 165: sanitizes prompt text, then trims it with a built-in string method.
  const why = normalizeText(promptEntry.why).trim(); // Defined line 165: sanitizes why-this-mattered text, then trims it with a built-in string method.
  const learning = normalizeText(promptEntry.learning).trim(); // Defined line 165: sanitizes learning text, then trims it with a built-in string method.
  if (!prompt || !learning) {
    return null;
  }

  return {
    category: normalizeText(promptEntry.category) || "Planning", // Defined line 165: sanitizes prompt category with a Planning fallback.
    prompt,
    why,
    learning
  };
}

function getCurrentProject() { // Line 205: returns the state for the active saved project.
  const project = projectStore.projects.find((item) => item.id === projectStore.activeProjectId); // Built-in API: finds the active project state record.
  return project?.state || structuredClone(defaultState); // Built-in API: falls back to a blank default state if the active project is missing.
}

function getCurrentProjectRecord() { // Line 210: returns the full active project record for metadata updates.
  return projectStore.projects.find((project) => project.id === projectStore.activeProjectId); // Built-in API: finds the active project metadata record.
}

function updateCurrentProject() { // Line 214: writes the current planner state back to the active project record.
  const project = getCurrentProjectRecord(); // Defined line 210: retrieves the active project record before updating it.
  if (!project) {
    return;
  }

  project.state = state;
  project.updatedAt = new Date().toISOString(); // Built-in API: refreshes the project's last-updated timestamp.
}

// Persistence is disabled during first hydration so opening the app cannot overwrite localStorage.
function persistProjectStore() { // Line 225: saves the project collection and legacy state copy to localStorage.
  if (!hasHydrated) {
    return;
  }

  localStorage.setItem(projectCollectionKey, JSON.stringify(projectStore)); // Browser API: saves the full project collection.
  localStorage.setItem(storageKey, JSON.stringify(state)); // Browser API: saves a legacy-compatible copy of the active project.
}

// Manual save keeps the active project and shows short feedback in the footer.
function saveState({ showStatus = true } = {}) { // Line 235: saves the active project and optionally shows footer feedback.
  updateCurrentProject(); // Defined line 214: writes current state into the active project before saving.
  persistProjectStore(); // Defined line 225: persists the active project and project collection.
  if (!showStatus) {
    return;
  }

  saveStatus.textContent = "Project saved.";
  setTimeout(() => { // Browser API: clears the temporary save message after a short delay.
    saveStatus.textContent = "";
  }, 2200);
}

// Clear Planner resets only the active project after confirmation.
function resetPlan() { // Line 249: clears the active planner after user confirmation.
  const confirmed = window.confirm("Clear this project's planner fields?"); // Browser API: asks before clearing the active planner.
  if (!confirmed) {
    return;
  }

  state = structuredClone(defaultState); // Built-in API: replaces the active state with a blank default copy.
  updateCurrentProject(); // Defined line 214: stores the cleared state in the active project record.
  persistProjectStore(); // Defined line 225: saves the cleared active project.
  syncFields(); // Defined line 335: updates the form fields after clearing.
  render(); // Defined line 405: refreshes the UI after clearing.
}

// New Project creates a blank saved project and makes it the active planner.
function createProject() { // Line 263: creates a blank saved project and switches to it.
  updateCurrentProject(); // Defined line 214: saves edits to the current project before creating another.
  const project = {
    id: createProjectId(), // Defined line 519: gives the new project a unique ID.
    updatedAt: new Date().toISOString(), // Built-in API: timestamps the new blank project.
    state: structuredClone(defaultState) // Built-in API: starts the new project from blank default state.
  };

  projectStore.projects.push(project); // Built-in API: adds the new blank project to the collection.
  projectStore.activeProjectId = project.id;
  state = project.state;
  syncFields(); // Defined line 335: clears the visible form fields for the new project.
  saveState(); // Defined line 235: persists the new active project.
  render(); // Defined line 405: refreshes the UI for the new project.
  document.querySelector("#projectName").focus(); // Browser API: moves focus to the project name input.
}

// Duplicate Project copies the active planner so users can branch an idea without retyping it.
function duplicateProject() { // Line 281: copies the active project into a new saved project.
  updateCurrentProject(); // Defined line 214: saves the current project before duplicating it.
  const duplicatedState = structuredClone(state); // Built-in API: creates an independent copy of the active project state.
  duplicatedState.projectName = duplicatedState.projectName
    ? `${duplicatedState.projectName} Copy`
    : "Untitled Project Copy";

  const project = {
    id: createProjectId(), // Defined line 519: gives the duplicated project a unique ID.
    updatedAt: new Date().toISOString(), // Built-in API: timestamps the duplicated project.
    state: duplicatedState
  };

  projectStore.projects.push(project); // Built-in API: adds the duplicated project to the collection.
  projectStore.activeProjectId = project.id;
  state = project.state;
  syncFields(); // Defined line 335: updates the form fields for the duplicated project.
  saveState(); // Defined line 235: persists the duplicated project.
  render(); // Defined line 405: refreshes the UI for the duplicated project.
}

// Delete Project removes the active saved project only after a project-specific confirmation.
function deleteProject() { // Line 303: deletes the active saved project after confirmation.
  if (projectStore.projects.length === 1) {
    window.alert("At least one project must remain."); // Browser API: warns that the final project cannot be deleted.
    return;
  }

  const currentProject = getCurrentProject(); // Defined line 205: reads the active project to name it in the confirmation.
  const projectName = currentProject?.projectName?.trim() || "Untitled Project"; // Built-in API: trims the active project name for the confirmation message.
  const confirmed = window.confirm(`Delete "${projectName}"? This cannot be undone.`); // Browser API: asks before deleting the active saved project.
  if (!confirmed) {
    return;
  }

  const currentIndex = projectStore.projects.findIndex((project) => project.id === projectStore.activeProjectId); // Built-in API: finds the active project's array position before deleting.
  projectStore.projects.splice(currentIndex, 1); // Built-in API: removes the active project from the collection.
  projectStore.activeProjectId = projectStore.projects[Math.max(0, currentIndex - 1)].id; // Built-in API: selects the nearest remaining project.
  state = getCurrentProject(); // Defined line 205: loads the next available project after deletion.
  syncFields(); // Defined line 335: updates form fields for the new active project.
  saveState(); // Defined line 235: persists the new active project selection.
  render(); // Defined line 405: refreshes the UI after deletion.
}

// The project switcher saves the current project before loading another saved project.
function switchProject() { // Line 326: switches the app to another saved project.
  updateCurrentProject(); // Defined line 214: saves the current project before switching away.
  projectStore.activeProjectId = projectSwitcher.value;
  state = getCurrentProject(); // Defined line 205: loads the selected saved project state.
  syncFields(); // Defined line 335: updates the form with the selected project.
  saveState(); // Defined line 235: persists the selected project as active.
  render(); // Defined line 405: refreshes the UI after switching projects.
}

function syncFields() { // Line 335: syncs form inputs with the current project state.
  fields.forEach((field) => { // Built-in API: updates each planner input from state.
    document.querySelector(`#${field}`).value = state[field] || ""; // Browser API: writes current state values into form inputs.
  });
}

// View switching updates the sidebar state and reveals the matching workspace section.
function showSection(sectionId) { // Line 342: displays the requested planner section and updates nav state.
  document.querySelectorAll(".nav-button").forEach((button) => { // Browser API: loops over nav buttons to update active styling.
    button.classList.toggle("active", button.dataset.section === sectionId); // Browser API: toggles active styling for each nav button.
  });

  document.querySelectorAll(".view").forEach((section) => { // Browser API: loops over view panels to show the selected section.
    section.classList.toggle("active", section.id === sectionId); // Browser API: toggles visibility for each section.
  });
}

// Feature tracking stores required and future items separately for planning and README output.
function addFeature() { // Line 353: adds a required or future feature to the active project.
  const input = document.querySelector("#featureText"); // Browser API: finds the feature text input.
  const type = document.querySelector("#featureType").value; // Browser API: reads the selected feature type.
  const text = input.value.trim(); // Built-in API: trims the entered feature text.

  if (!text) {
    input.focus(); // Browser API: returns focus to the empty feature input.
    return;
  }

  state.features.push({ text, type }); // Built-in API: appends the new feature to project state.
  updateCurrentProject(); // Defined line 214: stores the new feature in the active project record.
  persistProjectStore(); // Defined line 225: saves the updated feature list.
  input.value = "";
  render(); // Defined line 405: refreshes the feature lists and README output.
}

function removeFeature(index) { // Line 370: removes a feature from the active project by list index.
  state.features.splice(index, 1); // Built-in API: removes the selected feature from project state.
  updateCurrentProject(); // Defined line 214: stores the feature removal in the active project record.
  persistProjectStore(); // Defined line 225: saves the updated feature list.
  render(); // Defined line 405: refreshes the feature lists and README output.
}

// Prompt tracking captures the AI prompt, category, and lesson learned for project evidence.
function addPrompt() { // Line 378: saves an AI prompt and learning note to the active project.
  const category = document.querySelector("#promptCategory").value; // Browser API: reads the selected prompt category.
  const prompt = document.querySelector("#promptText").value.trim(); // Built-in API: trims the saved prompt text.
  const why = document.querySelector("#promptWhy").value.trim(); // Built-in API: trims the why-this-mattered note.
  const learning = document.querySelector("#promptLearning").value.trim(); // Built-in API: trims the learning note.

  if (!prompt || !learning) {
    return;
  }

  state.prompts.push({ category, prompt, why, learning }); // Built-in API: appends the prompt entry to project state.
  updateCurrentProject(); // Defined line 214: stores the prompt entry in the active project record.
  persistProjectStore(); // Defined line 225: saves the updated prompt history.
  document.querySelector("#promptText").value = ""; // Browser API: clears the prompt input.
  document.querySelector("#promptWhy").value = ""; // Browser API: clears the why-this-mattered input.
  document.querySelector("#promptLearning").value = ""; // Browser API: clears the learning input.
  render(); // Defined line 405: refreshes the prompt timeline.
}

function removePrompt(index) { // Line 397: removes a saved prompt entry by list index.
  state.prompts.splice(index, 1); // Built-in API: removes the selected prompt from project state.
  updateCurrentProject(); // Defined line 214: stores the prompt removal in the active project record.
  persistProjectStore(); // Defined line 225: saves the updated prompt history.
  render(); // Defined line 405: refreshes the prompt timeline.
}

// Rendering rebuilds all derived UI from the current state so lists, README, and score stay synced.
function render() { // Line 405: refreshes all derived UI from the current project state.
  renderProjectSwitcher(); // Defined line 415: refreshes saved-project dropdown options.
  renderFeatures(); // Defined line 428: refreshes required and future feature lists.
  renderPrompts(); // Defined line 454: refreshes the prompt timeline.
  renderChecklist(); // Defined line 490: refreshes the submission checklist.
  renderReadme(); // Defined line 527: refreshes the README draft output.
  renderReadiness(); // Defined line 532: refreshes the readiness score.
}

// Saved-project labels combine the project name with the last updated date in the dropdown.
function renderProjectSwitcher() { // Line 415: rebuilds the saved-project dropdown labels.
  projectSwitcher.innerHTML = "";

  projectStore.projects.forEach((project) => { // Built-in API: creates one dropdown option per saved project.
    const option = document.createElement("option"); // Browser API: creates a dropdown option for a saved project.
    option.value = project.id;
    option.textContent = getProjectLabel(project); // Defined line 510: formats the project label for the dropdown.
    option.selected = project.id === projectStore.activeProjectId;
    projectSwitcher.append(option); // Browser API: adds the saved project option to the dropdown.
  });
}

// Feature rendering uses DOM text nodes instead of interpolated HTML to avoid XSS from saved content.
function renderFeatures() { // Line 428: rebuilds required and future feature lists safely.
  requiredList.innerHTML = "";
  stretchList.innerHTML = "";

  state.features.forEach((feature, index) => { // Built-in API: renders every saved feature entry.
    const item = document.createElement("li"); // Browser API: creates a feature list item.
    const text = document.createElement("span"); // Browser API: creates a safe text wrapper for feature text.
    text.textContent = feature.text;
    item.append(text); // Browser API: adds feature text to the list item.

    const remove = document.createElement("button"); // Browser API: creates the feature remove button.
    remove.className = "remove-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeFeature(index)); // Defined line 370: calls removeFeature for this feature row.
    item.append(remove); // Browser API: adds the remove button to the feature item.

    if (feature.type === "required") {
      requiredList.append(item); // Browser API: places required features in the required list.
    } else {
      stretchList.append(item); // Browser API: places future features in the future list.
    }
  });
}

// Prompt rendering also writes user content through textContent/createTextNode for XSS safety.
function renderPrompts() { // Line 454: rebuilds the AI prompt timeline safely.
  promptList.innerHTML = "";

  state.prompts.forEach((entry, index) => { // Built-in API: renders every saved prompt entry.
    const item = document.createElement("li"); // Browser API: creates a prompt timeline item.
    const category = document.createElement("strong"); // Browser API: creates a category label element.
    category.textContent = entry.category;

    const prompt = document.createElement("p"); // Browser API: creates the prompt text paragraph.
    const promptLabel = document.createElement("b"); // Browser API: creates the prompt label.
    promptLabel.textContent = "Prompt:";
    prompt.append(promptLabel, document.createTextNode(` ${entry.prompt}`)); // Browser API: safely appends prompt label and text.

    const why = document.createElement("p"); // Browser API: creates the why-this-mattered paragraph.
    const whyLabel = document.createElement("b"); // Browser API: creates the why-this-mattered label.
    whyLabel.textContent = "Why this mattered:";
    why.append(whyLabel, document.createTextNode(` ${entry.why}`)); // Browser API: safely appends why label and text.

    const learning = document.createElement("p"); // Browser API: creates the learning text paragraph.
    const learningLabel = document.createElement("b"); // Browser API: creates the learning label.
    learningLabel.textContent = "What changed:";
    learning.append(learningLabel, document.createTextNode(` ${entry.learning}`)); // Browser API: safely appends learning label and text.

    item.append(category, prompt, why, learning); // Browser API: adds prompt details to the timeline item.

    const remove = document.createElement("button"); // Browser API: creates the prompt remove button.
    remove.className = "remove-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removePrompt(index)); // Defined line 397: calls removePrompt for this prompt row.
    item.append(remove); // Browser API: adds the remove button to the prompt item.
    promptList.append(item); // Browser API: adds the prompt item to the timeline.
  });
}

// The readiness checklist contributes to the score and persists each checked item.
function renderChecklist() { // Line 490: rebuilds the submission checklist and checkbox handlers.
  checklist.innerHTML = "";

  checklistItems.forEach(([key, label]) => { // Built-in API: renders every checklist item.
    const row = document.createElement("label"); // Browser API: creates a checklist row.
    const input = document.createElement("input"); // Browser API: creates the checklist checkbox.
    input.type = "checkbox";
    input.checked = Boolean(state.checklist[key]); // Built-in API: converts saved checklist state into a checkbox value.
    input.addEventListener("change", () => { // Browser API: handles checklist state changes.
      state.checklist[key] = input.checked;
      updateCurrentProject(); // Defined line 214: stores the changed checklist item in the active project.
      persistProjectStore(); // Defined line 225: saves the updated checklist.
      renderReadiness(); // Defined line 532: recalculates the score after checklist changes.
    });

    row.append(input, document.createTextNode(label)); // Browser API: safely adds checkbox and label text to the row.
    checklist.append(row); // Browser API: adds the row to the checklist.
  });
}

function getProjectLabel(project) { // Line 510: creates the dropdown label for a saved project.
  const name = project.state.projectName?.trim() || "Untitled Project"; // Built-in API: trims the project name for dropdown display.
  const updatedAt = new Date(project.updatedAt); // Built-in API: converts the saved timestamp into a Date.
  const dateLabel = Number.isNaN(updatedAt.getTime()) // Built-in API: checks whether the timestamp is valid.
    ? "Not saved"
    : updatedAt.toLocaleDateString(); // Built-in API: formats the last-updated date for display.
  return `${name} - ${dateLabel}`;
}

function createProjectId() { // Line 519: creates a unique ID for each saved project.
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID(); // Browser API: uses the browser crypto API for a strong unique ID.
  }

  return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`; // Built-in API: falls back to a timestamp/random ID when crypto is unavailable.
}

function renderReadme() { // Line 527: writes the generated README draft to the output panel.
  readmeOutput.textContent = buildReadme(); // Defined line 551: builds and displays the latest README draft.
}

// Readiness scoring turns completed planning fields, features, prompts, and checklist items into progress.
function renderReadiness() { // Line 532: calculates and displays the submission readiness score.
  const planFields = fields.filter((field) => state[field]).length; // Built-in API: counts completed planning fields.
  const hasRequired = state.features.some((feature) => feature.type === "required"); // Built-in API: checks for at least one required feature.
  const hasStretch = state.features.some((feature) => feature.type === "stretch"); // Built-in API: checks for at least one future improvement.
  const promptReady = state.prompts.length > 0;
  const checked = Object.values(state.checklist).filter(Boolean).length; // Built-in API: counts checked readiness items.
  const total = fields.length + 4 + checklistItems.length;
  const complete = planFields + Number(hasRequired) + Number(hasStretch) + Number(promptReady) + checked + 1; // Built-in API: converts completed requirements into a score numerator.
  const score = Math.round((complete / total) * 100); // Built-in API: rounds the readiness percentage.

  readinessScore.textContent = `${score}%`;
  readinessMessage.textContent = score >= 85
    ? "Ready for final review."
    : score >= 50
      ? "Good progress. Finish the missing sections."
      : "Start by defining the problem.";
}

// README generation converts the active project plan into a copyable Markdown draft.
function buildReadme() { // Line 551: builds the Markdown README draft from planner data.
  const projectName = state.projectName || "Project Name";
  const required = state.features
    .filter((feature) => feature.type === "required") // Built-in API: selects completed required features for README output.
    .map((feature) => `- ${feature.text}`) // Built-in API: formats each required feature as Markdown.
    .join("\n") || "- Add completed feature"; // Built-in API: joins required features or shows a placeholder.
  const stretch = state.features
    .filter((feature) => feature.type === "stretch") // Built-in API: selects future improvements for README output.
    .map((feature) => `- ${feature.text}`) // Built-in API: formats each future improvement as Markdown.
    .join("\n") || "- Add future improvement"; // Built-in API: joins future improvements or shows a placeholder.

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

// Copy README sends the generated Markdown draft to the clipboard and shows feedback.
async function copyReadme() { // Line 614: copies the generated README draft to the clipboard.
  await navigator.clipboard.writeText(buildReadme()); // Browser API plus defined line 542: builds and copies the latest README draft to the clipboard.
  saveStatus.textContent = "README draft copied.";
  setTimeout(() => { // Browser API: clears the temporary copy message after a short delay.
    saveStatus.textContent = "";
  }, 2200);
}

function buildDefaultPromptHistory() { // Line 622: returns the project prompt history used by fresh default state.
  return [
    {
      "category": "Project history",
      "prompt": "We are going to make an application. I am going to paste all the requirements and thought process in from my ChatGPT session.",
      "why": "The first step was not writing code. It was understanding the assignment requirements and deciding what kind of application would satisfy them.",
      "learning": "The pasted text was an assignment brief, not a specific app idea. Instead of inventing an unrelated project, we chose to build an app that directly supports the assignment: a Project Launch Planner that helps students define a problem, identify value, plan features, generate README content, track AI prompts, and prepare for submission."
    },
    {
      "category": "Project history",
      "prompt": "What is the smallest version of the project that proves the idea works?",
      "why": "The assignment emphasized building a small demonstration of value instead of many unfinished features.",
      "learning": "The smallest useful version became one complete workflow: enter a project plan, separate required and future features, generate a README draft, record prompts, and check submission readiness."
    },
    {
      "category": "Project history",
      "prompt": "Help me create the required features for the first working version.",
      "why": "Once the scope was clear, the next step was turning the plan into a working HTML, CSS, and JavaScript application.",
      "learning": "The first version included planning fields, required and future feature lists, a README generator, prompt-history tracking, local saving, a checklist, and a readiness score."
    },
    {
      "category": "Project history",
      "prompt": "The README should explain the project clearly before reviewers inspect the code.",
      "why": "The README is part of the project evaluation. It needs to explain what was planned, what was built, why it matters, and how to run it.",
      "learning": "The README was structured around the assignment requirements: project name, live demo, problem, value, project plan, completed features, future improvements, technologies, AI tools used, and running instructions."
    },
    {
      "category": "Project history",
      "prompt": "Review this feature against my original project value and identify anything unnecessary or missing.",
      "why": "After the first build, the app needed to be checked against the original assignment instead of judged only by whether the code ran.",
      "learning": "The app was reviewed against the submission checklist. It had a clear problem, value, project plan, features, documentation, prompt history, and code that could be explained."
    },
    {
      "category": "Project history",
      "prompt": "Let's make sure that any prompts are added to the prompt-history.md please.",
      "why": "The assignment asks for evidence of AI collaboration. That means the prompt history should show the real development process, not only sample prompts.",
      "learning": "The prompt history was updated as the project evolved, including follow-up requests, deployment work, debugging, and verification."
    },
    {
      "category": "Project history",
      "prompt": "Please host this up on GitHub Pages, I have already changed the settings to \"actions\".",
      "why": "The assignment required a working GitHub Pages link, so local success was not enough.",
      "learning": "A GitHub Actions workflow was added for Pages deployment, the README live demo link was updated, and the site was verified after deployment."
    },
    {
      "category": "Project history",
      "prompt": "Let's checkout a new feature branch and create a option for switching through saved projects.",
      "why": "The first app only handled one project plan. A user might want to plan more than one idea without losing previous work.",
      "learning": "A feature branch was created. The app was updated from one saved planner state to a collection of saved projects. The UI gained a project selector plus New, Duplicate, and Delete controls."
    },
    {
      "category": "Project history",
      "prompt": "This looks good, I like the feature. Let's push it up.",
      "why": "Once the feature looked useful, it needed to be pushed to GitHub so it could be reviewed separately from main.",
      "learning": "The saved-project feature branch was pushed to GitHub and prompt history was updated to show that the feature had been reviewed and approved for sharing."
    },
    {
      "category": "Project history",
      "prompt": "Check our live code for XXS expoits please.",
      "why": "The app stores and renders user-entered text. Any app that renders user input should be checked for cross-site scripting risk.",
      "learning": "The live code was reviewed for XSS exposure. Although escaped `innerHTML` was not immediately exploitable in normal use, the rendering was hardened by replacing user-content `innerHTML` with `textContent` and `createTextNode`."
    },
    {
      "category": "Project history",
      "prompt": "Looks good, let's create a feature branch for security hardening XSS and push.",
      "why": "Security hardening should be easy to review. A focused branch made the change easier to inspect.",
      "learning": "A security branch was created from the current main branch. User-content rendering was hardened, saved browser data was normalized, and the branch was pushed to GitHub."
    },
    {
      "category": "Project history",
      "prompt": "We don't seem to be saving the new projects in local storage, when I hit refresh I am losing the new content.",
      "why": "The saved-project switcher only mattered if projects survived a refresh. This was a real user-facing bug.",
      "learning": "The first persistence issue was that many edits updated the in-memory project but did not immediately write the project collection to localStorage. Autosave persistence was added for typing, checklist changes, feature changes, prompt changes, resets, and project switching."
    },
    {
      "category": "Project history",
      "prompt": "Let's push the changes for the persistent storage option.",
      "why": "After fixing persistence, the branch needed to be updated on GitHub for review.",
      "learning": "The persistence fix was pushed, and the prompt history was updated so the debugging path stayed visible."
    },
    {
      "category": "Project history",
      "prompt": "Check out a branch for localStorage refresh issue, the problem right now is that anytime I refresh, localStorage is overwritten.",
      "why": "The previous persistence fix helped edits save, but refresh still had a deeper problem: initialization could overwrite or discard stored project data.",
      "learning": "A focused branch was created for the refresh bug. Testing showed that saved-project normalization ran before `validFeatureTypes` was initialized. That caused normalization to throw, which made the app discard the saved project collection and fall back to legacy or default state. The initialization order was fixed, and app load was made read-only while real user edits still persist."
    },
    {
      "category": "Project history",
      "prompt": "Create a change log for the app from start to finish please.",
      "why": "The project needed a clear record of what changed over time, separate from the prompt history.",
      "learning": "A `CHANGELOG.md` file was created from the repository history. It summarizes the initial build, documentation, deployment, saved-project feature, XSS hardening, and localStorage refresh fixes."
    },
    {
      "category": "Project history",
      "prompt": "For this project, one of the requirements is how we think, what prompts we used, how we learned. Can you back fill the prompt history?",
      "why": "The existing prompt history had the right events, but it read too much like a short commit log. The assignment asks for evidence of thinking, learning, curiosity, debugging, and collaboration with AI.",
      "learning": "The prompt history was rewritten into a fuller narrative. Each entry now explains the prompt, why it mattered, what changed, and how it shows the development process."
    },
    {
      "category": "Project history",
      "prompt": "Let's add an edit option for the project name.",
      "why": "Saved projects need a clear, consistent place for renaming. The Define the project section already contains the project name field, so it is the natural place to make that edit.",
      "learning": "Editing the Project name field in Define the project renames the active saved project, refreshes the dropdown label, updates the README draft, and persists the change to localStorage. The redundant Rename switcher button was removed and its position now contains the single Delete control."
    },
    {
      "category": "Project history",
      "prompt": "Keep the option to rename the project in the Define Project section. Replace Rename button with Delete.",
      "why": "The switcher had duplicate controls for deletion and placed renaming away from the related project definition field.",
      "learning": "The saved-project switcher now has one Delete button in the former Rename position. The Project name field remains the single rename control for the active saved project."
    },
    {
      "category": "Project history",
      "prompt": "Moving forward, create feature creates a new feature branch, bugfix creates a bugfix branch, ui creates a ui branch, etc.",
      "why": "The project is now using branches for focused work. A clear branch naming rule makes future changes easier to organize by intent.",
      "learning": "Future branch requests should map the work type to the branch prefix: feature work uses `feature/`, bug fixes use `bugfix/`, UI work uses `ui/`, and similar work types should use a matching descriptive prefix."
    },
    {
      "category": "Project history",
      "prompt": "Feature: if Delete is clicked lets have a confirmation box before deleting the entry.",
      "why": "Deleting a saved project is destructive. A confirmation step helps prevent accidental loss of project planning content.",
      "learning": "The Delete action now confirms the specific saved project name before removing it. Canceling the confirmation leaves the saved project list unchanged."
    },
    {
      "category": "Project history",
      "prompt": "Let's push.",
      "why": "The delete confirmation feature needed to be saved in Git and published to the remote repository so it could be reviewed or merged later.",
      "learning": "The current feature branch was prepared for a commit and push with the delete confirmation, related documentation, and prompt-history updates included together."
    },
    {
      "category": "Project history",
      "prompt": "UI: swap Delete and Duplicate button placement, when complete test and push.",
      "why": "The saved-project controls needed a clearer order so the less destructive Duplicate action appears before the destructive Delete action.",
      "learning": "The saved-project switcher now places Duplicate before Delete while keeping the same button behavior, delete confirmation, and project persistence logic."
    },
    {
      "category": "Project history",
      "prompt": "Please create comments in the code explaining each feature.",
      "why": "The project must be understandable during review. Comments help connect the visible application features to the code that powers them.",
      "learning": "Comments were added around the main HTML sections and JavaScript feature groups for saved projects, planner inputs, feature tracking, prompt tracking, README generation, readiness scoring, localStorage persistence, and XSS-safe rendering."
    },
    {
      "category": "Project history",
      "prompt": "After each function call in script.js add a comment on the purpose and line number of said function.",
      "why": "The reviewer needs to understand what each JavaScript function does and where it lives in the file.",
      "learning": "Each function declaration in `script.js` now includes an inline comment with its line number and purpose. The line numbers were verified after editing so the comments match the final file."
    },
    {
      "category": "Project history",
      "prompt": "Do the same on each function call not just definition.",
      "why": "The earlier comments explained each function definition, but the reviewer also needs to see why functions and browser APIs are called throughout the file.",
      "learning": "Inline comments were added to the main function-call lines in `script.js`, including setup calls, localStorage calls, render calls, saved-project actions, DOM creation, event handlers, checklist updates, README generation, and clipboard behavior."
    },
    {
      "category": "Project history",
      "prompt": "I'm sorry, let me be clear. The line numbers we are adding are references to where the function is defined, not the line it's called at.",
      "why": "The previous call-site comments used the call-site line number, which was not the intended reference. The useful reference is where the local function is defined.",
      "learning": "Call-site comments in `script.js` now use `Defined line X` for local app functions. Browser and built-in API calls are labeled as `Browser API` or `Built-in API` instead of receiving misleading local line numbers."
    },
    {
      "category": "Project history",
      "prompt": "Make a commitHistory.md with the commit history.",
      "why": "The project now has enough Git history that a separate commit-history document helps explain how the work evolved over time.",
      "learning": "A `commitHistory.md` file was created from the actual Git log. It lists each commit hash, date, message, and a short explanation of the project impact."
    },
    {
      "category": "Project history",
      "prompt": "Push the new changes up.",
      "why": "The latest documentation and code-comment updates needed to be committed and published to the remote branch.",
      "learning": "The current UI branch was prepared for a commit and push containing the code comments, function-call reference corrections, commit history document, and prompt-history updates."
    },
    {
      "category": "Project history",
      "prompt": "Feature: why this mattered section. On the prompts page add a section between prompt used and what changed for \"Why this mattered\".",
      "why": "Prompt history is stronger when it explains not only what was asked and what changed, but also why that prompt was important to the project.",
      "learning": "The Prompts page now includes a `Why this mattered` textarea between `Prompt used` and `What changed`. Saved prompt entries persist this new field and render it in the prompt timeline."
    },
    {
      "category": "Project history",
      "prompt": "Feature: nice, now as a default state for the app, on any browser, take our prompt history and make that the default state.",
      "why": "A new browser previously opened with an empty prompt tracker. The project requirement is easier to demonstrate if the app starts with the actual prompt history already loaded.",
      "learning": "The app's default prompt state now seeds the prompt tracker from the project prompt history, including prompt text, why it mattered, and what changed."
    }
  ];
}
