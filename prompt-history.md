# Prompt History

## 1. Project Planning

**Prompt:**

> We are going to make an application. I am going to paste all the requirements and thought process in from my ChatGPT session.

**What I learned or changed:**

The pasted requirements were an assignment brief rather than a single app idea. The project became a tool that helps students complete that brief: a planner for problem definition, value, features, README content, prompt history, and submission readiness.

---

## 2. Smallest Demonstration of Value

**Prompt:**

> What is the smallest version of the project that proves the idea works?

**What I learned or changed:**

The smallest useful version should focus on one complete workflow. For this project, that meant a static planner that lets a user enter a project plan, generate documentation, track prompts, and check submission readiness.

---

## 3. Feature Development

**Prompt:**

> Help me create the required features for the first working version.

**What I learned or changed:**

The first version includes planning fields, required and future feature lists, a README generator, prompt history tracking, local saving, and a checklist. Export features were moved to future improvements to keep the project focused.

---

## 4. Documentation

**Prompt:**

> The README should explain the project clearly before reviewers inspect the code.

**What I learned or changed:**

The README was structured around the assignment requirements: project name, live demo, problem, value, plan, features, technologies, AI tools, and running instructions.

---

## 5. Verification

**Prompt:**

> Review this feature against my original project value and identify anything unnecessary or missing.

**What I learned or changed:**

The project was checked against the original submission checklist. The app includes the core value, a clear structure, documentation, prompt history, and code that can be explained during an interview.

---

## 6. Documentation Maintenance

**Prompt:**

> Let's make sure that any prompts are added to the prompt-history.md please.

**What I learned or changed:**

The prompt history was reviewed after the first build and updated to include the follow-up request itself. This keeps the documentation aligned with the actual development conversation instead of only listing sample prompts.

---

## 7. Deployment

**Prompt:**

> Please host this up on GitHub Pages, I have already changed the settings to "actions".

**What I learned or changed:**

A GitHub Actions workflow was added for GitHub Pages, the README live demo URL was updated, and the main branch was pushed to trigger deployment. The live site was verified after GitHub Pages finished publishing.

---

## 8. Saved Projects Feature

**Prompt:**

> Let's checkout a new feature branch and create a option for switching through saved projects.

**What I learned or changed:**

A feature branch was created for saved project switching. The app was updated from a single saved planner state to a saved-project collection, with controls to switch, create, duplicate, and delete project plans.

---

## 9. Feature Branch Push

**Prompt:**

> This looks good, I like the feature. Let's push it up.

**What I learned or changed:**

The saved-project switcher feature was approved for sharing, so the feature branch was pushed to GitHub after recording the prompt history update.

---

## 10. XSS Review

**Prompt:**

> Check our live code for XXS expoits please.

**What I learned or changed:**

The live app was reviewed for XSS risks in user-controlled rendering paths. The feature branch was hardened by replacing user-content `innerHTML` rendering with `textContent` and text nodes, plus localStorage normalization for malformed saved data.
