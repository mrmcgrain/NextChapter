const storageKey = "project-launch-planner";
const projectCollectionKey = "project-launch-planner-projects";

// Default planner content comes from seed.js so deployed project data stays explicit.
const defaultState = structuredClone(window.nextChapterSeed.project.state);

const validFeatureTypes = new Set(["required", "stretch"]); // Built-in API: creates the allowed feature-type lookup.
let hasHydrated = false, shouldPersistHydratedStore = false;
let projectStore = loadProjectStore(); // Defined line 66: initializes saved projects from browser storage.
let state = getCurrentProject(); // Defined line 227: loads the active project state into memory.

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
  button.addEventListener("click", () => showSection(button.dataset.section)); // Defined line 364: calls showSection when a nav button is clicked.
});

// Project definition inputs autosave into the active project and update generated outputs.
fields.forEach((field) => { // Built-in API: attaches input handlers to every planner field.
  const input = document.querySelector(`#${field}`); // Browser API: finds the form input that matches the current state field.
  input.value = state[field];
  input.addEventListener("input", () => { // Browser API: reacts when the user edits a project definition field.
    state[field] = input.value.trim(); // Built-in API: trims the typed field value before saving it.
    updateCurrentProject(); // Defined line 236: syncs the edited field into the active project record.
    persistProjectStore(); // Defined line 247: saves the edited project to localStorage.
    render(); // Defined line 427: refreshes generated output after the field change.
  });
});

projectSwitcher.addEventListener("change", switchProject); // Defined line 348: calls switchProject when a saved project is selected.
document.querySelector("#addFeature").addEventListener("click", addFeature); // Defined line 375: calls addFeature from the Add feature button.
document.querySelector("#addPrompt").addEventListener("click", addPrompt); // Defined line 400: calls addPrompt from the Save Prompt button.
document.querySelector("#copyReadme").addEventListener("click", copyReadme); // Defined line 636: calls copyReadme from the copy button.
document.querySelector("#savePlan").addEventListener("click", saveState); // Defined line 257: calls saveState from the footer save button.
document.querySelector("#newProject").addEventListener("click", createProject); // Defined line 285: calls createProject from the New button.
document.querySelector("#duplicateProject").addEventListener("click", duplicateProject); // Defined line 303: calls duplicateProject from the Duplicate button.
document.querySelector("#deleteProject").addEventListener("click", deleteProject); // Defined line 325: calls deleteProject from the Delete button.
document.querySelector("#resetPlan").addEventListener("click", resetPlan); // Defined line 271: calls resetPlan from the Clear Planner button.

render(); // Defined line 427: draws the initial UI from loaded state.
hasHydrated = true; if (shouldPersistHydratedStore) persistProjectStore(); // Defined line 247: saves any repaired default prompt history back to localStorage after initial hydration.

// Saved-project storage loads the multi-project collection and falls back to older single-project data.
function loadProjectStore() { // Line 66: loads saved project data from localStorage.
  const savedCollection = localStorage.getItem(projectCollectionKey); // Browser API: reads the saved project collection.
  try {
    if (savedCollection) {
      const parsed = JSON.parse(savedCollection); // Built-in API: parses the saved project collection JSON.
      if (parsed.projects?.length) {
        return normalizeProjectStore(parsed); // Defined line 106: validates the parsed project collection before use.
      }
    }
  } catch {
    localStorage.removeItem(projectCollectionKey); // Browser API: removes invalid collection data so the app can recover.
  }

  return createStoreFromLegacyState(); // Defined line 82: falls back to older single-project storage.
}

function createStoreFromLegacyState() { // Line 82: migrates older single-project saved data into the project collection.
  let legacyState = structuredClone(defaultState); // Built-in API: creates a clean default state for legacy migration.

  try {
    const savedLegacyState = localStorage.getItem(storageKey); // Browser API: reads older single-project localStorage data.
    if (savedLegacyState) {
      legacyState = normalizeState(JSON.parse(savedLegacyState)); // Defined line 129: parses and validates the older saved state.
    }
  } catch {
    localStorage.removeItem(storageKey); // Browser API: removes invalid legacy data so migration can continue.
  }

  const project = {
    id: createProjectId(), // Defined line 541: assigns a unique ID to the migrated project.
    updatedAt: new Date().toISOString(), // Built-in API: stamps the migrated project with the current save time.
    state: legacyState
  };

  return {
    activeProjectId: project.id,
    projects: [project]
  };
}

function normalizeProjectStore(store) { // Line 106: repairs saved project collection data before the app uses it.
  const projects = store.projects.map((project) => ({ // Built-in API: normalizes every saved project record.
    id: project.id || createProjectId(), // Defined line 541: fills in missing project IDs.
    updatedAt: project.updatedAt || new Date().toISOString(), // Built-in API: fills in missing update timestamps.
    state: normalizeState(project.state || {}) // Defined line 129: validates each saved project's planner state.
  }));
  const hasSeedProject = projects.some((project) => project.state.projectName === defaultState.projectName); // Built-in API: checks whether the demo seed project already exists.
  if (!hasSeedProject) {
    projects.push({
      id: window.nextChapterSeed.project.id || createProjectId(), // Defined line 541: reuses the stable seed ID when available.
      updatedAt: new Date().toISOString(), // Built-in API: timestamps the appended seed project.
      state: structuredClone(defaultState)
    });
    shouldPersistHydratedStore = true;
  }

  const activeProjectId = projects.some((project) => project.id === store.activeProjectId) // Built-in API: checks whether the saved active project still exists.
    ? store.activeProjectId
    : projects[0].id;

  return { activeProjectId, projects };
}

function normalizeState(rawState = {}) { // Line 129: fills missing planner fields and validates saved state shape.
  const source = rawState && typeof rawState === "object" ? rawState : {};
  if (isEmptySavedState(source)) {
    return structuredClone(defaultState);
  }

  const normalized = { ...structuredClone(defaultState), ...source }; // Built-in API: starts with default state before applying saved values.
  normalized.projectName = normalizeText(source.projectName); // Defined line 187: sanitizes saved project name text.
  normalized.targetUser = normalizeText(source.targetUser); // Defined line 187: sanitizes saved target user text.
  normalized.problem = normalizeText(source.problem); // Defined line 187: sanitizes saved problem text.
  normalized.value = normalizeText(source.value); // Defined line 187: sanitizes saved value text.
  normalized.solution = normalizeText(source.solution); // Defined line 187: sanitizes saved solution text.
  normalized.mvp = normalizeText(source.mvp); // Defined line 187: sanitizes saved MVP text.
  normalized.features = Array.isArray(source.features) // Built-in API: checks that saved features are an array before using them.
    ? source.features.map(normalizeFeature).filter(Boolean) // Defined line 191: validates feature entries, then filters invalid results.
    : structuredClone(defaultState.features); // Built-in API: restores default starter features when saved data is invalid.
  normalized.prompts = Array.isArray(source.prompts) // Built-in API: checks that saved prompts are an array before using them.
    ? source.prompts.map(normalizePrompt).filter(Boolean) // Defined line 207: validates prompt entries, then filters invalid results.
    : [];
  if (!source.isBlankProject && normalized.projectName === defaultState.projectName && normalized.prompts.length === 0) {
    normalized.prompts = structuredClone(defaultState.prompts); shouldPersistHydratedStore = true; // Built-in API: restores seeded prompt history from seed.js and marks the repaired state for persistence.
  }
  normalized.checklist = { ...structuredClone(defaultState.checklist), ...(source.checklist || {}) }; // Built-in API: merges saved checklist flags over defaults.
  return normalized;
}

function isEmptySavedState(source) { // Line 155: detects blank saved data that should receive the seeded default.
  const textFieldsEmpty = ["projectName", "targetUser", "problem", "value", "solution", "mvp"]
    .every((field) => !normalizeText(source[field]).trim());
  const featureEntries = Array.isArray(source.features) ? source.features : [];
  const promptEntries = Array.isArray(source.prompts) ? source.prompts : [];
  const checklistValues = source.checklist && typeof source.checklist === "object"
    ? Object.values(source.checklist)
    : [];

  return !source.isBlankProject
    && textFieldsEmpty
    && featureEntries.length === 0
    && promptEntries.length === 0
    && checklistValues.every((value) => !value);
}

function createBlankProjectState() { // Line 171: returns an empty planner state for new saved projects.
  return {
    ...structuredClone(defaultState),
    projectName: "",
    targetUser: "",
    problem: "",
    value: "",
    solution: "",
    mvp: "", isBlankProject: true,
    features: [],
    prompts: [],
    checklist: structuredClone(defaultState.checklist)
  };
}

// User-controlled saved data is normalized before rendering so bad stored shapes cannot break the UI.
function normalizeText(value) { // Line 187: converts non-string values into safe empty text.
  return typeof value === "string" ? value : "";
}

function normalizeFeature(feature) { // Line 191: validates a saved feature entry and its required/future type.
  if (!feature || typeof feature !== "object") {
    return null;
  }

  const text = normalizeText(feature.text).trim(); // Defined line 187: sanitizes feature text, then trims it with a built-in string method.
  if (!text) {
    return null;
  }

  return {
    text,
    type: validFeatureTypes.has(feature.type) ? feature.type : "stretch" // Built-in API: validates the saved feature type.
  };
}

function normalizePrompt(promptEntry) { // Line 207: validates a saved prompt-history entry.
  if (!promptEntry || typeof promptEntry !== "object") {
    return null;
  }

  const prompt = normalizeText(promptEntry.prompt).trim(); // Defined line 187: sanitizes prompt text, then trims it with a built-in string method.
  const why = normalizeText(promptEntry.why).trim(); // Defined line 187: sanitizes why-this-mattered text, then trims it with a built-in string method.
  const learning = normalizeText(promptEntry.learning).trim(); // Defined line 187: sanitizes learning text, then trims it with a built-in string method.
  if (!prompt || !learning) {
    return null;
  }

  return {
    category: normalizeText(promptEntry.category) || "Planning", // Defined line 187: sanitizes prompt category with a Planning fallback.
    prompt,
    why,
    learning
  };
}

function getCurrentProject() { // Line 227: returns the state for the active saved project.
  const project = projectStore.projects.find((item) => item.id === projectStore.activeProjectId); // Built-in API: finds the active project state record.
  return project?.state || structuredClone(defaultState); // Built-in API: falls back to a blank default state if the active project is missing.
}

function getCurrentProjectRecord() { // Line 232: returns the full active project record for metadata updates.
  return projectStore.projects.find((project) => project.id === projectStore.activeProjectId); // Built-in API: finds the active project metadata record.
}

function updateCurrentProject() { // Line 236: writes the current planner state back to the active project record.
  const project = getCurrentProjectRecord(); // Defined line 232: retrieves the active project record before updating it.
  if (!project) {
    return;
  }

  project.state = state;
  project.updatedAt = new Date().toISOString(); // Built-in API: refreshes the project's last-updated timestamp.
}

// Persistence is disabled during first hydration so opening the app cannot overwrite localStorage.
function persistProjectStore() { // Line 247: saves the project collection and legacy state copy to localStorage.
  if (!hasHydrated) {
    return;
  }

  localStorage.setItem(projectCollectionKey, JSON.stringify(projectStore)); // Browser API: saves the full project collection.
  localStorage.setItem(storageKey, JSON.stringify(state)); // Browser API: saves a legacy-compatible copy of the active project.
}

// Manual save keeps the active project and shows short feedback in the footer.
function saveState({ showStatus = true } = {}) { // Line 257: saves the active project and optionally shows footer feedback.
  updateCurrentProject(); // Defined line 236: writes current state into the active project before saving.
  persistProjectStore(); // Defined line 247: persists the active project and project collection.
  if (!showStatus) {
    return;
  }

  saveStatus.textContent = "Project saved.";
  setTimeout(() => { // Browser API: clears the temporary save message after a short delay.
    saveStatus.textContent = "";
  }, 2200);
}

// Clear Planner resets only the active project after confirmation.
function resetPlan() { // Line 271: clears the active planner after user confirmation.
  const confirmed = window.confirm("Clear this project's planner fields?"); // Browser API: asks before clearing the active planner.
  if (!confirmed) {
    return;
  }

  state = structuredClone(defaultState); // Built-in API: replaces the active state with a blank default copy.
  updateCurrentProject(); // Defined line 236: stores the cleared state in the active project record.
  persistProjectStore(); // Defined line 247: saves the cleared active project.
  syncFields(); // Defined line 357: updates the form fields after clearing.
  render(); // Defined line 427: refreshes the UI after clearing.
}

// New Project creates a blank saved project and makes it the active planner.
function createProject() { // Line 285: creates a blank saved project and switches to it.
  updateCurrentProject(); // Defined line 236: saves edits to the current project before creating another.
  const project = {
    id: createProjectId(), // Defined line 541: gives the new project a unique ID.
    updatedAt: new Date().toISOString(), // Built-in API: timestamps the new blank project.
    state: createBlankProjectState() // Defined line 171: starts the new project from an empty planner state.
  };

  projectStore.projects.push(project); // Built-in API: adds the new blank project to the collection.
  projectStore.activeProjectId = project.id;
  state = project.state;
  syncFields(); // Defined line 357: clears the visible form fields for the new project.
  saveState(); // Defined line 257: persists the new active project.
  render(); // Defined line 427: refreshes the UI for the new project.
  document.querySelector("#projectName").focus(); // Browser API: moves focus to the project name input.
}

// Duplicate Project copies the active planner so users can branch an idea without retyping it.
function duplicateProject() { // Line 303: copies the active project into a new saved project.
  updateCurrentProject(); // Defined line 236: saves the current project before duplicating it.
  const duplicatedState = structuredClone(state); // Built-in API: creates an independent copy of the active project state.
  duplicatedState.projectName = duplicatedState.projectName
    ? `${duplicatedState.projectName} Copy`
    : "Untitled Project Copy";

  const project = {
    id: createProjectId(), // Defined line 541: gives the duplicated project a unique ID.
    updatedAt: new Date().toISOString(), // Built-in API: timestamps the duplicated project.
    state: duplicatedState
  };

  projectStore.projects.push(project); // Built-in API: adds the duplicated project to the collection.
  projectStore.activeProjectId = project.id;
  state = project.state;
  syncFields(); // Defined line 357: updates the form fields for the duplicated project.
  saveState(); // Defined line 257: persists the duplicated project.
  render(); // Defined line 427: refreshes the UI for the duplicated project.
}

// Delete Project removes the active saved project only after a project-specific confirmation.
function deleteProject() { // Line 325: deletes the active saved project after confirmation.
  if (projectStore.projects.length === 1) {
    window.alert("At least one project must remain."); // Browser API: warns that the final project cannot be deleted.
    return;
  }

  const currentProject = getCurrentProject(); // Defined line 227: reads the active project to name it in the confirmation.
  const projectName = currentProject?.projectName?.trim() || "Untitled Project"; // Built-in API: trims the active project name for the confirmation message.
  const confirmed = window.confirm(`Delete "${projectName}"? This cannot be undone.`); // Browser API: asks before deleting the active saved project.
  if (!confirmed) {
    return;
  }

  const currentIndex = projectStore.projects.findIndex((project) => project.id === projectStore.activeProjectId); // Built-in API: finds the active project's array position before deleting.
  projectStore.projects.splice(currentIndex, 1); // Built-in API: removes the active project from the collection.
  projectStore.activeProjectId = projectStore.projects[Math.max(0, currentIndex - 1)].id; // Built-in API: selects the nearest remaining project.
  state = getCurrentProject(); // Defined line 227: loads the next available project after deletion.
  syncFields(); // Defined line 357: updates form fields for the new active project.
  saveState(); // Defined line 257: persists the new active project selection.
  render(); // Defined line 427: refreshes the UI after deletion.
}

// The project switcher saves the current project before loading another saved project.
function switchProject() { // Line 348: switches the app to another saved project.
  updateCurrentProject(); // Defined line 236: saves the current project before switching away.
  projectStore.activeProjectId = projectSwitcher.value;
  state = getCurrentProject(); // Defined line 227: loads the selected saved project state.
  syncFields(); // Defined line 357: updates the form with the selected project.
  saveState(); // Defined line 257: persists the selected project as active.
  render(); // Defined line 427: refreshes the UI after switching projects.
}

function syncFields() { // Line 357: syncs form inputs with the current project state.
  fields.forEach((field) => { // Built-in API: updates each planner input from state.
    document.querySelector(`#${field}`).value = state[field] || ""; // Browser API: writes current state values into form inputs.
  });
}

// View switching updates the sidebar state and reveals the matching workspace section.
function showSection(sectionId) { // Line 364: displays the requested planner section and updates nav state.
  document.querySelectorAll(".nav-button").forEach((button) => { // Browser API: loops over nav buttons to update active styling.
    button.classList.toggle("active", button.dataset.section === sectionId); // Browser API: toggles active styling for each nav button.
  });

  document.querySelectorAll(".view").forEach((section) => { // Browser API: loops over view panels to show the selected section.
    section.classList.toggle("active", section.id === sectionId); // Browser API: toggles visibility for each section.
  });
}

// Feature tracking stores required and future items separately for planning and README output.
function addFeature() { // Line 375: adds a required or future feature to the active project.
  const input = document.querySelector("#featureText"); // Browser API: finds the feature text input.
  const type = document.querySelector("#featureType").value; // Browser API: reads the selected feature type.
  const text = input.value.trim(); // Built-in API: trims the entered feature text.

  if (!text) {
    input.focus(); // Browser API: returns focus to the empty feature input.
    return;
  }

  state.features.push({ text, type }); // Built-in API: appends the new feature to project state.
  updateCurrentProject(); // Defined line 236: stores the new feature in the active project record.
  persistProjectStore(); // Defined line 247: saves the updated feature list.
  input.value = "";
  render(); // Defined line 427: refreshes the feature lists and README output.
}

function removeFeature(index) { // Line 392: removes a feature from the active project by list index.
  state.features.splice(index, 1); // Built-in API: removes the selected feature from project state.
  updateCurrentProject(); // Defined line 236: stores the feature removal in the active project record.
  persistProjectStore(); // Defined line 247: saves the updated feature list.
  render(); // Defined line 427: refreshes the feature lists and README output.
}

// Prompt tracking captures the AI prompt, category, and lesson learned for project evidence.
function addPrompt() { // Line 400: saves an AI prompt and learning note to the active project.
  const category = document.querySelector("#promptCategory").value; // Browser API: reads the selected prompt category.
  const prompt = document.querySelector("#promptText").value.trim(); // Built-in API: trims the saved prompt text.
  const why = document.querySelector("#promptWhy").value.trim(); // Built-in API: trims the why-this-mattered note.
  const learning = document.querySelector("#promptLearning").value.trim(); // Built-in API: trims the learning note.

  if (!prompt || !learning) {
    return;
  }

  state.prompts.push({ category, prompt, why, learning }); // Built-in API: appends the prompt entry to project state.
  updateCurrentProject(); // Defined line 236: stores the prompt entry in the active project record.
  persistProjectStore(); // Defined line 247: saves the updated prompt history.
  document.querySelector("#promptText").value = ""; // Browser API: clears the prompt input.
  document.querySelector("#promptWhy").value = ""; // Browser API: clears the why-this-mattered input.
  document.querySelector("#promptLearning").value = ""; // Browser API: clears the learning input.
  render(); // Defined line 427: refreshes the prompt timeline.
}

function removePrompt(index) { // Line 419: removes a saved prompt entry by list index.
  state.prompts.splice(index, 1); // Built-in API: removes the selected prompt from project state.
  updateCurrentProject(); // Defined line 236: stores the prompt removal in the active project record.
  persistProjectStore(); // Defined line 247: saves the updated prompt history.
  render(); // Defined line 427: refreshes the prompt timeline.
}

// Rendering rebuilds all derived UI from the current state so lists, README, and score stay synced.
function render() { // Line 427: refreshes all derived UI from the current project state.
  renderProjectSwitcher(); // Defined line 437: refreshes saved-project dropdown options.
  renderFeatures(); // Defined line 450: refreshes required and future feature lists.
  renderPrompts(); // Defined line 476: refreshes the prompt timeline.
  renderChecklist(); // Defined line 512: refreshes the submission checklist.
  renderReadme(); // Defined line 549: refreshes the README draft output.
  renderReadiness(); // Defined line 554: refreshes the readiness score.
}

// Saved-project labels combine the project name with the last updated date in the dropdown.
function renderProjectSwitcher() { // Line 437: rebuilds the saved-project dropdown labels.
  projectSwitcher.innerHTML = "";

  projectStore.projects.forEach((project) => { // Built-in API: creates one dropdown option per saved project.
    const option = document.createElement("option"); // Browser API: creates a dropdown option for a saved project.
    option.value = project.id;
    option.textContent = getProjectLabel(project); // Defined line 532: formats the project label for the dropdown.
    option.selected = project.id === projectStore.activeProjectId;
    projectSwitcher.append(option); // Browser API: adds the saved project option to the dropdown.
  });
}

// Feature rendering uses DOM text nodes instead of interpolated HTML to avoid XSS from saved content.
function renderFeatures() { // Line 450: rebuilds required and future feature lists safely.
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
    remove.addEventListener("click", () => removeFeature(index)); // Defined line 392: calls removeFeature for this feature row.
    item.append(remove); // Browser API: adds the remove button to the feature item.

    if (feature.type === "required") {
      requiredList.append(item); // Browser API: places required features in the required list.
    } else {
      stretchList.append(item); // Browser API: places future features in the future list.
    }
  });
}

// Prompt rendering also writes user content through textContent/createTextNode for XSS safety.
function renderPrompts() { // Line 476: rebuilds the AI prompt timeline safely.
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
    remove.addEventListener("click", () => removePrompt(index)); // Defined line 419: calls removePrompt for this prompt row.
    item.append(remove); // Browser API: adds the remove button to the prompt item.
    promptList.append(item); // Browser API: adds the prompt item to the timeline.
  });
}

// The readiness checklist contributes to the score and persists each checked item.
function renderChecklist() { // Line 512: rebuilds the submission checklist and checkbox handlers.
  checklist.innerHTML = "";

  checklistItems.forEach(([key, label]) => { // Built-in API: renders every checklist item.
    const row = document.createElement("label"); // Browser API: creates a checklist row.
    const input = document.createElement("input"); // Browser API: creates the checklist checkbox.
    input.type = "checkbox";
    input.checked = Boolean(state.checklist[key]); // Built-in API: converts saved checklist state into a checkbox value.
    input.addEventListener("change", () => { // Browser API: handles checklist state changes.
      state.checklist[key] = input.checked;
      updateCurrentProject(); // Defined line 236: stores the changed checklist item in the active project.
      persistProjectStore(); // Defined line 247: saves the updated checklist.
      renderReadiness(); // Defined line 554: recalculates the score after checklist changes.
    });

    row.append(input, document.createTextNode(label)); // Browser API: safely adds checkbox and label text to the row.
    checklist.append(row); // Browser API: adds the row to the checklist.
  });
}

function getProjectLabel(project) { // Line 532: creates the dropdown label for a saved project.
  const name = project.state.projectName?.trim() || "Untitled Project"; // Built-in API: trims the project name for dropdown display.
  const updatedAt = new Date(project.updatedAt); // Built-in API: converts the saved timestamp into a Date.
  const dateLabel = Number.isNaN(updatedAt.getTime()) // Built-in API: checks whether the timestamp is valid.
    ? "Not saved"
    : updatedAt.toLocaleDateString(); // Built-in API: formats the last-updated date for display.
  return `${name} - ${dateLabel}`;
}

function createProjectId() { // Line 541: creates a unique ID for each saved project.
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID(); // Browser API: uses the browser crypto API for a strong unique ID.
  }

  return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`; // Built-in API: falls back to a timestamp/random ID when crypto is unavailable.
}

function renderReadme() { // Line 549: writes the generated README draft to the output panel.
  readmeOutput.textContent = buildReadme(); // Defined line 573: builds and displays the latest README draft.
}

// Readiness scoring turns completed planning fields, features, prompts, and checklist items into progress.
function renderReadiness() { // Line 554: calculates and displays the submission readiness score.
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
function buildReadme() { // Line 573: builds the Markdown README draft from planner data.
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
async function copyReadme() { // Line 636: copies the generated README draft to the clipboard.
  await navigator.clipboard.writeText(buildReadme()); // Browser API plus defined line 573: builds and copies the latest README draft to the clipboard.
  saveStatus.textContent = "README draft copied.";
  setTimeout(() => { // Browser API: clears the temporary copy message after a short delay.
    saveStatus.textContent = "";
  }, 2200);
}
