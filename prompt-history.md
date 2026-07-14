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

---

## 22. Swap Delete and Duplicate Buttons

**Prompt:**

> UI: swap Delete and Duplicate button placement, when complete test and push.

**Why this mattered:**

The saved-project controls needed a clearer order so the less destructive Duplicate action appears before the destructive Delete action.

**What I learned or changed:**

The saved-project switcher now places Duplicate before Delete while keeping the same button behavior, delete confirmation, and project persistence logic.

**How this shows my thinking:**

This small UI adjustment reduces the chance of reaching for a destructive action by accident and keeps the control order aligned with user intent.

---

## 23. Code Feature Comments

**Prompt:**

> Please create comments in the code explaining each feature.

**Why this mattered:**

The project must be understandable during review. Comments help connect the visible application features to the code that powers them.

**What I learned or changed:**

Comments were added around the main HTML sections and JavaScript feature groups for saved projects, planner inputs, feature tracking, prompt tracking, README generation, readiness scoring, localStorage persistence, and XSS-safe rendering.

**How this shows my thinking:**

The comments explain why each feature area exists without documenting every line, so the code stays readable and still shows the structure of the application.

---

## 24. Function Purpose and Line Comments

**Prompt:**

> After each function call in script.js add a comment on the purpose and line number of said function.

**Why this mattered:**

The reviewer needs to understand what each JavaScript function does and where it lives in the file.

**What I learned or changed:**

Each function declaration in `script.js` now includes an inline comment with its line number and purpose. The line numbers were verified after editing so the comments match the final file.

**How this shows my thinking:**

This makes the implementation easier to discuss during review because each function identifies its role directly at the point where it is defined.

---

## 25. Function Call Purpose Comments

**Prompt:**

> Do the same on each function call not just definition.

**Why this mattered:**

The earlier comments explained each function definition, but the reviewer also needs to see why functions and browser APIs are called throughout the file.

**What I learned or changed:**

Inline comments were added to the main function-call lines in `script.js`, including setup calls, localStorage calls, render calls, saved-project actions, DOM creation, event handlers, checklist updates, README generation, and clipboard behavior.

**How this shows my thinking:**

This documents the flow of the application at the point where each behavior is triggered, making the code easier to trace from user action to state update to rendered output.

---

## 26. Function Definition Line References

**Prompt:**

> I'm sorry, let me be clear. The line numbers we are adding are references to where the function is defined, not the line it's called at.

**Why this mattered:**

The previous call-site comments used the call-site line number, which was not the intended reference. The useful reference is where the local function is defined.

**What I learned or changed:**

Call-site comments in `script.js` now use `Defined line X` for local app functions. Browser and built-in API calls are labeled as `Browser API` or `Built-in API` instead of receiving misleading local line numbers.

**How this shows my thinking:**

This makes the comments more accurate for code review because a reader can jump from a call to the function definition that explains the implementation.

---

## 27. Commit History Documentation

**Prompt:**

> Make a commitHistory.md with the commit history.

**Why this mattered:**

The project now has enough Git history that a separate commit-history document helps explain how the work evolved over time.

**What I learned or changed:**

A `commitHistory.md` file was created from the actual Git log. It lists each commit hash, date, message, and a short explanation of the project impact.

**How this shows my thinking:**

This gives reviewers a direct bridge between the Git history and the project story, showing how planning, deployment, saved projects, security, persistence, UI, and documentation work happened over time.

---

## 28. Push Documentation and Comment Updates

**Prompt:**

> Push the new changes up.

**Why this mattered:**

The latest documentation and code-comment updates needed to be committed and published to the remote branch.

**What I learned or changed:**

The current UI branch was prepared for a commit and push containing the code comments, function-call reference corrections, commit history document, and prompt-history updates.

**How this shows my thinking:**

This keeps the remote branch current with the local project documentation and makes the latest review materials available on GitHub.

---

## 29. Prompt Why This Mattered Field

**Prompt:**

> Feature: why this mattered section. On the prompts page add a section between prompt used and what changed for "Why this mattered".

**Why this mattered:**

Prompt history is stronger when it explains not only what was asked and what changed, but also why that prompt was important to the project.

**What I learned or changed:**

The Prompts page now includes a `Why this mattered` textarea between `Prompt used` and `What changed`. Saved prompt entries persist this new field and render it in the prompt timeline.

**How this shows my thinking:**

This makes the app's built-in prompt tracker match the narrative structure already used in `prompt-history.md`, helping users capture better AI collaboration evidence as they work.

---

## 30. Default Prompt History State

**Prompt:**

> Feature: nice, now as a default state for the app, on any browser, take our prompt history and make that the default state.

**Why this mattered:**

A new browser previously opened with an empty prompt tracker. The project requirement is easier to demonstrate if the app starts with the actual prompt history already loaded.

**What I learned or changed:**

The app's default prompt state now seeds the prompt tracker from the project prompt history, including prompt text, why it mattered, and what changed.

**How this shows my thinking:**

This turns the documentation work into part of the app experience, so the live planner immediately shows the AI collaboration story instead of requiring a user to re-enter it.

---

## 31. Default Plan State

**Prompt:**

> Update the default state for Plan from the README and default saved project as "Project Launch Planner".

**Why this mattered:**

A fresh browser should demonstrate the actual project immediately, not start with a blank plan.

**What I learned or changed:**

The default Plan fields now use the Project Launch Planner details from the README, and the default saved project name is `Project Launch Planner`.

**How this shows my thinking:**

This aligns the live app, README, and default browser state so reviewers see the same project story across the application and documentation.

---

## 32. Push Default State Updates

**Prompt:**

> Looks great, make sure we update the prompt history, changelog and go ahead and push the new changes please.

**Why this mattered:**

The default prompt-history and Plan state changes needed to be documented and published to the remote feature branch.

**What I learned or changed:**

The changelog already included the default-state updates, and the prompt history was updated with this push request before committing and pushing the branch.

**How this shows my thinking:**

This keeps the repository history, changelog, and prompt history aligned with the latest application behavior.

---

## 33. New Project Blank State Bugfix

**Prompt:**

> Bug: new should clear all fields for a new project.

**Why this mattered:**

After the app started using the project history as its default state, the New button began copying that seeded state instead of creating a blank project.

**What I learned or changed:**

A separate blank project state was added for the New action. Fresh browsers still start with the populated Project Launch Planner default, older empty saved states upgrade to that default, and clicking New creates an empty project with clear plan fields, no features, no prompts, and an unchecked checklist.

**How this shows my thinking:**

This separates two different concepts: the demo state shown to first-time visitors and the blank state users expect when starting a new saved project.

---

## 34. Push New Project Bugfix

**Prompt:**

> Looks good, go ahead and push.

**Why this mattered:**

The New project blank-state fix needed to be committed and published to the remote bugfix branch.

**What I learned or changed:**

The bugfix branch was prepared for commit and push after confirming the empty saved-state migration and New button behavior.

**How this shows my thinking:**

This keeps the remote repository aligned with the verified local fix so the bug can be reviewed or merged.

---

## 35. Default Prompt LocalStorage Bugfix

**Prompt:**

> Bugfix: I don't see the prompts on the GitHub Pages page. Please fix this for the default localStorage.

**Why this mattered:**

Older saved browser state could contain the default Project Launch Planner project without the newly seeded prompt-history entries.

**What I learned or changed:**

When the saved default Project Launch Planner state has no prompts, the app now refills prompts from the seeded prompt history. Intentionally blank projects created with New stay blank.

**How this shows my thinking:**

This fixes the migration path for existing browsers without overwriting user-created blank projects or unrelated saved project plans.

---

## 36. Deployed Prompt Array Persistence Fix

**Prompt:**

> Locally local storage has the prompt array full, on the deployed GitHub Pages site the prompt array is empty still. Please ensure that the NextChapter project includes the prompt array to see the history on the deployed site.

**Why this mattered:**

The deployed site needed the same visible prompt history as the local app, and the browser's stored default project should contain the prompt array after migration.

**What I learned or changed:**

The app already repaired empty default prompts in memory, but initial hydration avoided writing to localStorage. A targeted hydration migration now persists the repaired default prompt array after load while still protecting unrelated saved project data.

**How this shows my thinking:**

This separated display repair from storage repair, which matters because deployed browser state can keep older localStorage even after the source code is updated.

---

## 37. Seed File Source of Truth

**Prompt:**

> Create a seed file. Within that file I want the Next Chapter project state including the prompt history.

**Why this mattered:**

The default project state should be easy to inspect and deploy as one complete payload instead of being hidden inside application logic.

**What I learned or changed:**

A dedicated `seed.js` file now contains the default NextChapter project state, including the project plan, features, checklist, and full prompt-history array. The app loads that seed before `script.js`.

**How this shows my thinking:**

This makes the seeded data explicit and separates project content from app behavior, which makes the deployment state easier to verify.
