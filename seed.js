// Seed data for the deployed NextChapter default project.
window.nextChapterSeed = {
  "project": {
    "id": "next-chapter-default-project",
    "updatedAt": "2026-07-14T00:00:00.000Z",
    "state": {
      "projectName": "Project Launch Planner",
      "targetUser": "Students building a first software project",
      "problem": "Students building a first software project often have the assignment requirements, but not a clear path for turning those requirements into a focused application, complete documentation, and a submission-ready checklist.",
      "value": "Project Launch Planner helps a student make stronger decisions before writing or submitting code. It guides them through the problem, user, value, smallest useful version, required features, future features, README draft, prompt history, and submission checklist.",
      "solution": "A browser-based planner that saves a project idea, separates required and future features, generates a README draft, tracks meaningful AI prompts, and measures submission readiness.",
      "mvp": "The smallest demonstration of value is a static HTML, CSS, and JavaScript application that can run locally or on GitHub Pages without a build step.",
      "features": [
        {
          "text": "Create a guided project planning form",
          "type": "required"
        },
        {
          "text": "Generate a README draft from the plan",
          "type": "required"
        },
        {
          "text": "Track selected AI prompts and lessons learned",
          "type": "required"
        },
        {
          "text": "Export project files as a downloadable package",
          "type": "stretch"
        },
        {
          "text": "connect a DB for views outside of browser created in", "type": "stretch"

        }
        ,
        { "text": "Create a dark mode", "type": "stretch" }

      ],



      "prompts": [
        {
          "prompt": "We are going to make an application. I am going to paste all the requirements and thought process in from my ChatGPT session.",
          "why": "The first step was not writing code. It was understanding the assignment requirements and deciding what kind of application would satisfy them.",
          "learning": "The pasted text was an assignment brief, not a specific app idea. Instead of inventing an unrelated project, we chose to build an app that directly supports the assignment: a Project Launch Planner that helps students define a problem, identify value, plan features, generate README content, track AI prompts, and prepare for submission.",
          "category": "Project history"
        },
        {
          "prompt": "What is the smallest version of the project that proves the idea works?",
          "why": "The assignment emphasized building a small demonstration of value instead of many unfinished features.",
          "learning": "The smallest useful version became one complete workflow: enter a project plan, separate required and future features, generate a README draft, record prompts, and check submission readiness.",
          "category": "Project history"
        },
        {
          "prompt": "Help me create the required features for the first working version.",
          "why": "Once the scope was clear, the next step was turning the plan into a working HTML, CSS, and JavaScript application.",
          "learning": "The first version included planning fields, required and future feature lists, a README generator, prompt-history tracking, local saving, a checklist, and a readiness score.",
          "category": "Project history"
        },
        {
          "prompt": "The README should explain the project clearly before reviewers inspect the code.",
          "why": "The README is part of the project evaluation. It needs to explain what was planned, what was built, why it matters, and how to run it.",
          "learning": "The README was structured around the assignment requirements: project name, live demo, problem, value, project plan, completed features, future improvements, technologies, AI tools used, and running instructions.",
          "category": "Project history"
        },
        {
          "prompt": "Review this feature against my original project value and identify anything unnecessary or missing.",
          "why": "After the first build, the app needed to be checked against the original assignment instead of judged only by whether the code ran.",
          "learning": "The app was reviewed against the submission checklist. It had a clear problem, value, project plan, features, documentation, prompt history, and code that could be explained.",
          "category": "Project history"
        },
        {
          "prompt": "Let's make sure that any prompts are added to the prompt-history.md please.",
          "why": "The assignment asks for evidence of AI collaboration. That means the prompt history should show the real development process, not only sample prompts.",
          "learning": "The prompt history was updated as the project evolved, including follow-up requests, deployment work, debugging, and verification.",
          "category": "Project history"
        },
        {
          "prompt": "Please host this up on GitHub Pages, I have already changed the settings to \"actions\".",
          "why": "The assignment required a working GitHub Pages link, so local success was not enough.",
          "learning": "A GitHub Actions workflow was added for Pages deployment, the README live demo link was updated, and the site was verified after deployment.",
          "category": "Project history"
        },
        {
          "prompt": "Let's checkout a new feature branch and create a option for switching through saved projects.",
          "why": "The first app only handled one project plan. A user might want to plan more than one idea without losing previous work.",
          "learning": "A feature branch was created. The app was updated from one saved planner state to a collection of saved projects. The UI gained a project selector plus New, Duplicate, and Delete controls.",
          "category": "Project history"
        },
        {
          "prompt": "This looks good, I like the feature. Let's push it up.",
          "why": "Once the feature looked useful, it needed to be pushed to GitHub so it could be reviewed separately from main.",
          "learning": "The saved-project feature branch was pushed to GitHub and prompt history was updated to show that the feature had been reviewed and approved for sharing.",
          "category": "Project history"
        },
        {
          "prompt": "Check our live code for XXS expoits please.",
          "why": "The app stores and renders user-entered text. Any app that renders user input should be checked for cross-site scripting risk.",
          "learning": "The live code was reviewed for XSS exposure. Although escaped `innerHTML` was not immediately exploitable in normal use, the rendering was hardened by replacing user-content `innerHTML` with `textContent` and `createTextNode`.",
          "category": "Project history"
        },
        {
          "prompt": "Looks good, let's create a feature branch for security hardening XSS and push.",
          "why": "Security hardening should be easy to review. A focused branch made the change easier to inspect.",
          "learning": "A security branch was created from the current main branch. User-content rendering was hardened, saved browser data was normalized, and the branch was pushed to GitHub.",
          "category": "Project history"
        },
        {
          "prompt": "We don't seem to be saving the new projects in local storage, when I hit refresh I am losing the new content.",
          "why": "The saved-project switcher only mattered if projects survived a refresh. This was a real user-facing bug.",
          "learning": "The first persistence issue was that many edits updated the in-memory project but did not immediately write the project collection to localStorage. Autosave persistence was added for typing, checklist changes, feature changes, prompt changes, resets, and project switching.",
          "category": "Project history"
        },
        {
          "prompt": "Let's push the changes for the persistent storage option.",
          "why": "After fixing persistence, the branch needed to be updated on GitHub for review.",
          "learning": "The persistence fix was pushed, and the prompt history was updated so the debugging path stayed visible.",
          "category": "Project history"
        },
        {
          "prompt": "Check out a branch for localStorage refresh issue, the problem right now is that anytime I refresh, localStorage is overwritten.",
          "why": "The previous persistence fix helped edits save, but refresh still had a deeper problem: initialization could overwrite or discard stored project data.",
          "learning": "A focused branch was created for the refresh bug. Testing showed that saved-project normalization ran before `validFeatureTypes` was initialized. That caused normalization to throw, which made the app discard the saved project collection and fall back to legacy or default state. The initialization order was fixed, and app load was made read-only while real user edits still persist.",
          "category": "Project history"
        },
        {
          "prompt": "Create a change log for the app from start to finish please.",
          "why": "The project needed a clear record of what changed over time, separate from the prompt history.",
          "learning": "A `CHANGELOG.md` file was created from the repository history. It summarizes the initial build, documentation, deployment, saved-project feature, XSS hardening, and localStorage refresh fixes.",
          "category": "Project history"
        },
        {
          "prompt": "For this project, one of the requirements is how we think, what prompts we used, how we learned. Can you back fill the prompt history?",
          "why": "The existing prompt history had the right events, but it read too much like a short commit log. The assignment asks for evidence of thinking, learning, curiosity, debugging, and collaboration with AI.",
          "learning": "The prompt history was rewritten into a fuller narrative. Each entry now explains the prompt, why it mattered, what changed, and how it shows the development process.",
          "category": "Project history"
        },
        {
          "prompt": "Let's add an edit option for the project name.",
          "why": "Saved projects need a clear, consistent place for renaming. The Define the project section already contains the project name field, so it is the natural place to make that edit.",
          "learning": "Editing the Project name field in Define the project renames the active saved project, refreshes the dropdown label, updates the README draft, and persists the change to localStorage. The redundant Rename switcher button was removed and its position now contains the single Delete control.",
          "category": "Project history"
        },
        {
          "prompt": "Keep the option to rename the project in the Define Project section. Replace Rename button with Delete.",
          "why": "The switcher had duplicate controls for deletion and placed renaming away from the related project definition field.",
          "learning": "The saved-project switcher now has one Delete button in the former Rename position. The Project name field remains the single rename control for the active saved project.",
          "category": "Project history"
        },
        {
          "prompt": "Moving forward, create feature creates a new feature branch, bugfix creates a bugfix branch, ui creates a ui branch, etc.",
          "why": "The project is now using branches for focused work. A clear branch naming rule makes future changes easier to organize by intent.",
          "learning": "Future branch requests should map the work type to the branch prefix: feature work uses `feature/`, bug fixes use `bugfix/`, UI work uses `ui/`, and similar work types should use a matching descriptive prefix.",
          "category": "Project history"
        },
        {
          "prompt": "Feature: if Delete is clicked lets have a confirmation box before deleting the entry.",
          "why": "Deleting a saved project is destructive. A confirmation step helps prevent accidental loss of project planning content.",
          "learning": "The Delete action now confirms the specific saved project name before removing it. Canceling the confirmation leaves the saved project list unchanged.",
          "category": "Project history"
        },
        {
          "prompt": "Let's push.",
          "why": "The delete confirmation feature needed to be saved in Git and published to the remote repository so it could be reviewed or merged later.",
          "learning": "The current feature branch was prepared for a commit and push with the delete confirmation, related documentation, and prompt-history updates included together.",
          "category": "Project history"
        },
        {
          "prompt": "UI: swap Delete and Duplicate button placement, when complete test and push.",
          "why": "The saved-project controls needed a clearer order so the less destructive Duplicate action appears before the destructive Delete action.",
          "learning": "The saved-project switcher now places Duplicate before Delete while keeping the same button behavior, delete confirmation, and project persistence logic.",
          "category": "Project history"
        },
        {
          "prompt": "Please create comments in the code explaining each feature.",
          "why": "The project must be understandable during review. Comments help connect the visible application features to the code that powers them.",
          "learning": "Comments were added around the main HTML sections and JavaScript feature groups for saved projects, planner inputs, feature tracking, prompt tracking, README generation, readiness scoring, localStorage persistence, and XSS-safe rendering.",
          "category": "Project history"
        },
        {
          "prompt": "After each function call in script.js add a comment on the purpose and line number of said function.",
          "why": "The reviewer needs to understand what each JavaScript function does and where it lives in the file.",
          "learning": "Each function declaration in `script.js` now includes an inline comment with its line number and purpose. The line numbers were verified after editing so the comments match the final file.",
          "category": "Project history"
        },
        {
          "prompt": "Do the same on each function call not just definition.",
          "why": "The earlier comments explained each function definition, but the reviewer also needs to see why functions and browser APIs are called throughout the file.",
          "learning": "Inline comments were added to the main function-call lines in `script.js`, including setup calls, localStorage calls, render calls, saved-project actions, DOM creation, event handlers, checklist updates, README generation, and clipboard behavior.",
          "category": "Project history"
        },
        {
          "prompt": "I'm sorry, let me be clear. The line numbers we are adding are references to where the function is defined, not the line it's called at.",
          "why": "The previous call-site comments used the call-site line number, which was not the intended reference. The useful reference is where the local function is defined.",
          "learning": "Call-site comments in `script.js` now use `Defined line X` for local app functions. Browser and built-in API calls are labeled as `Browser API` or `Built-in API` instead of receiving misleading local line numbers.",
          "category": "Project history"
        },
        {
          "prompt": "Make a commitHistory.md with the commit history.",
          "why": "The project now has enough Git history that a separate commit-history document helps explain how the work evolved over time.",
          "learning": "A `commitHistory.md` file was created from the actual Git log. It lists each commit hash, date, message, and a short explanation of the project impact.",
          "category": "Project history"
        },
        {
          "prompt": "Push the new changes up.",
          "why": "The latest documentation and code-comment updates needed to be committed and published to the remote branch.",
          "learning": "The current UI branch was prepared for a commit and push containing the code comments, function-call reference corrections, commit history document, and prompt-history updates.",
          "category": "Project history"
        },
        {
          "prompt": "Feature: why this mattered section. On the prompts page add a section between prompt used and what changed for \"Why this mattered\".",
          "why": "Prompt history is stronger when it explains not only what was asked and what changed, but also why that prompt was important to the project.",
          "learning": "The Prompts page now includes a `Why this mattered` textarea between `Prompt used` and `What changed`. Saved prompt entries persist this new field and render it in the prompt timeline.",
          "category": "Project history"
        },
        {
          "prompt": "Feature: nice, now as a default state for the app, on any browser, take our prompt history and make that the default state.",
          "why": "A new browser previously opened with an empty prompt tracker. The project requirement is easier to demonstrate if the app starts with the actual prompt history already loaded.",
          "learning": "The app's default prompt state now seeds the prompt tracker from the project prompt history, including prompt text, why it mattered, and what changed.",
          "category": "Project history"
        },
        {
          "prompt": "Update the default state for Plan from the README and default saved project as \"Project Launch Planner\".",
          "why": "A fresh browser should demonstrate the actual project immediately, not start with a blank plan.",
          "learning": "The default Plan fields now use the Project Launch Planner details from the README, and the default saved project name is `Project Launch Planner`.",
          "category": "Project history"
        },
        {
          "prompt": "Looks great, make sure we update the prompt history, changelog and go ahead and push the new changes please.",
          "why": "The default prompt-history and Plan state changes needed to be documented and published to the remote feature branch.",
          "learning": "The changelog already included the default-state updates, and the prompt history was updated with this push request before committing and pushing the branch.",
          "category": "Project history"
        },
        {
          "prompt": "Bug: new should clear all fields for a new project.",
          "why": "After the app started using the project history as its default state, the New button began copying that seeded state instead of creating a blank project.",
          "learning": "A separate blank project state was added for the New action. Fresh browsers still start with the populated Project Launch Planner default, older empty saved states upgrade to that default, and clicking New creates an empty project with clear plan fields, no features, no prompts, and an unchecked checklist.",
          "category": "Project history"
        },
        {
          "prompt": "Looks good, go ahead and push.",
          "why": "The New project blank-state fix needed to be committed and published to the remote bugfix branch.",
          "learning": "The bugfix branch was prepared for commit and push after confirming the empty saved-state migration and New button behavior.",
          "category": "Project history"
        },
        {
          "prompt": "Bugfix: I don't see the prompts on the GitHub Pages page. Please fix this for the default localStorage.",
          "why": "Older saved browser state could contain the default Project Launch Planner project without the newly seeded prompt-history entries.",
          "learning": "When the saved default Project Launch Planner state has no prompts, the app now refills prompts from the seeded prompt history. Intentionally blank projects created with New stay blank.",
          "category": "Project history"
        },
        {
          "prompt": "Locally local storage has the prompt array full, on the deployed GitHub Pages site the prompt array is empty still. Please ensure that the NextChapter project includes the prompt array to see the history on the deployed site.",
          "why": "The deployed site needed the same visible prompt history as the local app, and the browser's stored default project should contain the prompt array after migration.",
          "learning": "The app already repaired empty default prompts in memory, but initial hydration avoided writing to localStorage. A targeted hydration migration now persists the repaired default prompt array after load while still protecting unrelated saved project data.",
          "category": "Project history"
        },
        {
          "prompt": "Create a seed file. Within that file I want the Next Chapter project state including the prompt history.",
          "why": "The default project state should be easy to inspect and deploy as one complete payload instead of being hidden inside application logic.",
          "learning": "A dedicated `seed.js` file now contains the default NextChapter project state, including the project plan, features, checklist, and full prompt-history array. The app loads that seed before `script.js`.",
          "category": "Project history"
        }
      ],
      "checklist": {
        "repo": false,
        "pages": false,
        "app": false,
        "readme": false,
        "promptHistory": false,
        "commits": false,
        "structure": false,
        "value": false,
        "explain": false
      }
    }
  }
};
