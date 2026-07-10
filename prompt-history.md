# Prompt History

This file records selected prompts from the project build. It does not include every message. It focuses on prompts that show planning, decision-making, debugging, verification, security review, and how AI was used as a collaborator rather than a replacement for understanding the project.

## 1. Starting With Requirements

**Prompt:**

> We are going to make an application. I am going to paste all the requirements and thought process in from my ChatGPT session.

**Why this mattered:**

The first step was not writing code. It was understanding the assignment requirements and deciding what kind of application would satisfy them.

**What I learned or changed:**

The pasted text was an assignment brief, not a specific app idea. Instead of inventing an unrelated project, we chose to build an app that directly supports the assignment: a Project Launch Planner that helps students define a problem, identify value, plan features, generate README content, track AI prompts, and prepare for submission.

**How this shows my thinking:**

I learned that a strong project can come from the requirements themselves. The app idea was chosen because it solved a real workflow problem in the assignment: students need help organizing their thinking before submitting code.

---

## 2. Defining the Smallest Useful Version

**Prompt:**

> What is the smallest version of the project that proves the idea works?

**Why this mattered:**

The assignment emphasized building a small demonstration of value instead of many unfinished features.

**What I learned or changed:**

The smallest useful version became one complete workflow: enter a project plan, separate required and future features, generate a README draft, record prompts, and check submission readiness.

**How this shows my thinking:**

This helped narrow the scope. Features like exporting files, importing data, and printable views were useful, but they were moved to future improvements because they were not needed to prove the core idea.

---

## 3. Building the First Working App

**Prompt:**

> Help me create the required features for the first working version.

**Why this mattered:**

Once the scope was clear, the next step was turning the plan into a working HTML, CSS, and JavaScript application.

**What I learned or changed:**

The first version included planning fields, required and future feature lists, a README generator, prompt-history tracking, local saving, a checklist, and a readiness score.

**How this shows my thinking:**

The app was built as a static site because that matched the assignment, kept deployment simple, and made the code easier to explain. I chose a complete browser-based workflow over a more complex app stack.

---

## 4. Writing the README Before Review

**Prompt:**

> The README should explain the project clearly before reviewers inspect the code.

**Why this mattered:**

The README is part of the project evaluation. It needs to explain what was planned, what was built, why it matters, and how to run it.

**What I learned or changed:**

The README was structured around the assignment requirements: project name, live demo, problem, value, project plan, completed features, future improvements, technologies, AI tools used, and running instructions.

**How this shows my thinking:**

This helped me treat documentation as part of the product, not an afterthought. The README tells the story of the project before someone reads the code.

---

## 5. Checking the App Against the Original Goal

**Prompt:**

> Review this feature against my original project value and identify anything unnecessary or missing.

**Why this mattered:**

After the first build, the app needed to be checked against the original assignment instead of judged only by whether the code ran.

**What I learned or changed:**

The app was reviewed against the submission checklist. It had a clear problem, value, project plan, features, documentation, prompt history, and code that could be explained.

**How this shows my thinking:**

This prompt helped verify that the build stayed aligned with the user and assignment. It also helped separate required features from future improvements.

---

## 6. Keeping Prompt History Current

**Prompt:**

> Let's make sure that any prompts are added to the prompt-history.md please.

**Why this mattered:**

The assignment asks for evidence of AI collaboration. That means the prompt history should show the real development process, not only sample prompts.

**What I learned or changed:**

The prompt history was updated as the project evolved, including follow-up requests, deployment work, debugging, and verification.

**How this shows my thinking:**

I learned that prompt history is useful when it explains decisions and changes. It should show iteration, not just the final answer.

---

## 7. Deploying to GitHub Pages

**Prompt:**

> Please host this up on GitHub Pages, I have already changed the settings to "actions".

**Why this mattered:**

The assignment required a working GitHub Pages link, so local success was not enough.

**What I learned or changed:**

A GitHub Actions workflow was added for Pages deployment, the README live demo link was updated, and the site was verified after deployment.

**How this shows my thinking:**

This step showed the difference between "the app works on my computer" and "the app is actually usable by a reviewer." The live URL became part of the project deliverable.

---

## 8. Adding Saved Projects

**Prompt:**

> Let's checkout a new feature branch and create a option for switching through saved projects.

**Why this mattered:**

The first app only handled one project plan. A user might want to plan more than one idea without losing previous work.

**What I learned or changed:**

A feature branch was created. The app was updated from one saved planner state to a collection of saved projects. The UI gained a project selector plus New, Duplicate, and Delete controls.

**How this shows my thinking:**

This feature improved the app's real usefulness while keeping it related to the original goal. It also introduced a more complex state model, which later required better persistence testing.

---

## 9. Sharing the Saved Projects Feature

**Prompt:**

> This looks good, I like the feature. Let's push it up.

**Why this mattered:**

Once the feature looked useful, it needed to be pushed to GitHub so it could be reviewed separately from main.

**What I learned or changed:**

The saved-project feature branch was pushed to GitHub and prompt history was updated to show that the feature had been reviewed and approved for sharing.

**How this shows my thinking:**

Using a feature branch helped keep the work organized and made the project history easier to explain.

---

## 10. Reviewing for XSS Risk

**Prompt:**

> Check our live code for XXS expoits please.

**Why this mattered:**

The app stores and renders user-entered text. Any app that renders user input should be checked for cross-site scripting risk.

**What I learned or changed:**

The live code was reviewed for XSS exposure. Although escaped `innerHTML` was not immediately exploitable in normal use, the rendering was hardened by replacing user-content `innerHTML` with `textContent` and `createTextNode`.

**How this shows my thinking:**

This is an example of questioning the implementation, not just accepting that it works. I learned that safer DOM APIs are better than relying on manual escaping when rendering user-controlled content.

---

## 11. Creating a Focused Security Branch

**Prompt:**

> Looks good, let's create a feature branch for security hardening XSS and push.

**Why this mattered:**

Security hardening should be easy to review. A focused branch made the change easier to inspect.

**What I learned or changed:**

A security branch was created from the current main branch. User-content rendering was hardened, saved browser data was normalized, and the branch was pushed to GitHub.

**How this shows my thinking:**

This showed a better workflow: isolate security work, keep the diff focused, verify it, and push it for review.

---

## 12. Debugging Saved Project Persistence

**Prompt:**

> We don't seem to be saving the new projects in local storage, when I hit refresh I am losing the new content.

**Why this mattered:**

The saved-project switcher only mattered if projects survived a refresh. This was a real user-facing bug.

**What I learned or changed:**

The first persistence issue was that many edits updated the in-memory project but did not immediately write the project collection to localStorage. Autosave persistence was added for typing, checklist changes, feature changes, prompt changes, resets, and project switching.

**How this shows my thinking:**

This showed why testing must match the user workflow. It is not enough for a Save button to exist if users naturally expect edits to persist after refresh.

---

## 13. Pushing the Persistence Fix

**Prompt:**

> Let's push the changes for the persistent storage option.

**Why this mattered:**

After fixing persistence, the branch needed to be updated on GitHub for review.

**What I learned or changed:**

The persistence fix was pushed, and the prompt history was updated so the debugging path stayed visible.

**How this shows my thinking:**

This reinforced the habit of keeping code changes and documentation history in sync.

---

## 14. Fixing Refresh Overwrite Behavior

**Prompt:**

> Check out a branch for localStorage refresh issue, the problem right now is that anytime I refresh, localStorage is overwritten.

**Why this mattered:**

The previous persistence fix helped edits save, but refresh still had a deeper problem: initialization could overwrite or discard stored project data.

**What I learned or changed:**

A focused branch was created for the refresh bug. Testing showed that saved-project normalization ran before `validFeatureTypes` was initialized. That caused normalization to throw, which made the app discard the saved project collection and fall back to legacy or default state. The initialization order was fixed, and app load was made read-only while real user edits still persist.

**How this shows my thinking:**

This was the most important debugging lesson. The visible symptom was "refresh loses data," but the cause was initialization order and error handling. A small smoke test was added to prove that refresh does not rewrite localStorage and that edits still persist.

---

## 15. Creating a Changelog

**Prompt:**

> Create a change log for the app from start to finish please.

**Why this mattered:**

The project needed a clear record of what changed over time, separate from the prompt history.

**What I learned or changed:**

A `CHANGELOG.md` file was created from the repository history. It summarizes the initial build, documentation, deployment, saved-project feature, XSS hardening, and localStorage refresh fixes.

**How this shows my thinking:**

The changelog helps explain the technical evolution of the project, while this prompt history explains the learning and decision-making process behind those changes.

---

## 16. Backfilling the Prompt History

**Prompt:**

> For this project, one of the requirements is how we think, what prompts we used, how we learned. Can you back fill the prompt history?

**Why this mattered:**

The existing prompt history had the right events, but it read too much like a short commit log. The assignment asks for evidence of thinking, learning, curiosity, debugging, and collaboration with AI.

**What I learned or changed:**

The prompt history was rewritten into a fuller narrative. Each entry now explains the prompt, why it mattered, what changed, and how it shows the development process.

**How this shows my thinking:**

This final pass makes the file stronger for review because it connects prompts to decisions. It shows how the project moved from planning, to implementation, to deployment, to feature work, to security review, to debugging and verification.

---

## 17. Project Rename Control

**Prompt:**

> Let's add an edit option for the project name.

**Why this mattered:**

Saved projects need a clear, consistent place for renaming. The Define the project section already contains the project name field, so it is the natural place to make that edit.

**What I learned or changed:**

Editing the Project name field in Define the project renames the active saved project, refreshes the dropdown label, updates the README draft, and persists the change to localStorage. The redundant Rename switcher button was removed and its position now contains the single Delete control.

**How this shows my thinking:**

This keeps project naming in the same workflow as the rest of the project definition, while keeping destructive project management actions in the saved-project switcher.

---

## 18. Rename Placement and Delete Control

**Prompt:**

> Keep the option to rename the project in the Define Project section. Replace Rename button with Delete.

**Why this mattered:**

The switcher had duplicate controls for deletion and placed renaming away from the related project definition field.

**What I learned or changed:**

The saved-project switcher now has one Delete button in the former Rename position. The Project name field remains the single rename control for the active saved project.

**How this shows my thinking:**

The adjustment reduces duplicate actions and makes the interface match the workflow: define a project in the form, then manage saved projects from the switcher.

---

## 19. Branch Naming Workflow

**Prompt:**

> Moving forward, create feature creates a new feature branch, bugfix creates a bugfix branch, ui creates a ui branch, etc.

**Why this mattered:**

The project is now using branches for focused work. A clear branch naming rule makes future changes easier to organize by intent.

**What I learned or changed:**

Future branch requests should map the work type to the branch prefix: feature work uses `feature/`, bug fixes use `bugfix/`, UI work uses `ui/`, and similar work types should use a matching descriptive prefix.

**How this shows my thinking:**

This keeps Git history readable and makes it easier to understand why a branch exists before looking at the code changes.

---

## 20. Delete Confirmation

**Prompt:**

> Feature: if Delete is clicked lets have a confirmation box before deleting the entry.

**Why this mattered:**

Deleting a saved project is destructive. A confirmation step helps prevent accidental loss of project planning content.

**What I learned or changed:**

The Delete action now confirms the specific saved project name before removing it. Canceling the confirmation leaves the saved project list unchanged.

**How this shows my thinking:**

This adds a small safety check at the exact point of risk, without changing the saved-project workflow or requiring extra setup.

---

## 21. Push Delete Confirmation Work

**Prompt:**

> Let's push.

**Why this mattered:**

The delete confirmation feature needed to be saved in Git and published to the remote repository so it could be reviewed or merged later.

**What I learned or changed:**

The current feature branch was prepared for a commit and push with the delete confirmation, related documentation, and prompt-history updates included together.

**How this shows my thinking:**

This keeps the remote branch aligned with the local work and preserves the implementation history for the project submission.
