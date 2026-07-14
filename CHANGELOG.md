# Changelog

All notable changes to Project Launch Planner are documented here.

## 2026-07-14 - Seed File Source of Truth

### Changed

- Added `seed.js` as the source of truth for the default NextChapter project state, including the full prompt-history array.
- Loaded `seed.js` before `script.js` so the deployed app initializes from the seeded project payload.

### Verified

- Confirmed the seed prompt count matches `prompt-history.md`.
- Ran the seed-backed localStorage regression tests for default prompts, refresh persistence, and blank project migration.

## 2026-07-14 - Deployed Prompt Array Persistence Fix

### Fixed

- Ensured repaired default Project Launch Planner prompt history is written back into localStorage after the deployed app hydrates.
- Kept first-load storage protection in place so normal saved project data is not overwritten during page initialization.

### Verified

- Confirmed the default prompt seed contains the full prompt-history set before pushing to `main`.

## 2026-07-13 - Default Prompt LocalStorage Fix

### Fixed

- Fixed saved default Project Launch Planner states with empty prompt arrays so they refill from the seeded prompt history.
- Preserved intentionally blank projects created with the New button.

### Verified

- Confirmed JavaScript syntax with `node --check script.js`.
- Ran localStorage regression tests for refresh persistence, blank project migration, and default prompt seeding.

## 2026-07-13 - New Project Blank State Fix

### Fixed

- Fixed the New button so it creates a blank saved project instead of copying the seeded default demo state.
- Kept the fresh-browser default state populated with the Project Launch Planner plan and prompt history.
- Upgraded older empty saved states to the seeded default while preserving intentionally blank new projects.

### Verified

- Confirmed JavaScript syntax with `node --check script.js`.

## 2026-07-13 - Default Prompt History State

### Added

- Seeded the default prompt tracker with the project's prompt history for fresh browsers.
- Added the prompt text, why it mattered, and what changed for each seeded prompt entry.
- Seeded the default Plan section with the Project Launch Planner details from the README.

### Verified

- Confirmed JavaScript syntax with `node --check script.js`.

## 2026-07-13 - Prompt Why This Mattered Field

### Added

- Added a `Why this mattered` field between `Prompt used` and `What changed` on the Prompts page.
- Saved and rendered the new prompt context with each prompt-history entry.

### Verified

- Confirmed JavaScript syntax with `node --check script.js`.

## 2026-07-09 - Delete Confirmation

### Changed

- Added a project-specific confirmation before deleting a saved project.
- Kept the existing guard that prevents deleting the final remaining project.

### Verified

- Confirmed JavaScript syntax with `node --check script.js`.

## 2026-07-05 - LocalStorage Refresh Fix

### Fixed

- Fixed a refresh issue where saved project data could be replaced by legacy or default state.
- Moved `validFeatureTypes` initialization before saved-project normalization so stored project collections can load safely.
- Made initial app load read-only for localStorage writes.
- Kept autosave behavior for real user edits, checklist changes, prompt updates, feature changes, reset actions, and project switching.

### Verified

- Added and ran a localStorage refresh smoke test to confirm saved projects survive reload.
- Confirmed JavaScript syntax with `node --check script.js`.

## 2026-07-05 - Security Hardening

### Changed

- Replaced user-content `innerHTML` rendering with `textContent` and `createTextNode`.
- Added normalization for saved browser data before rendering.
- Kept only safe `innerHTML = ""` usage for clearing containers before rebuilding list content.

### Verified

- Reviewed the live app for XSS risk in user-controlled rendering paths.
- Confirmed the hardened branch no longer renders saved feature or prompt text through interpolated HTML.

## 2026-07-05 - Saved Project Switcher

### Added

- Added a saved project selector near the top of the application.
- Added controls to create a new project plan, duplicate an existing plan, and delete a saved plan.
- Migrated from a single saved planner state to a saved-project collection in browser localStorage.
- Preserved legacy single-project storage as the first saved project during migration.

### Changed

- Updated the Save button label to clarify that it saves the current project.
- Updated README completed features to include multi-project support.

### Verified

- Checked desktop and mobile screenshots for the new saved-project controls.
- Confirmed JavaScript syntax with `node --check script.js`.

## 2026-07-05 - GitHub Pages Deployment

### Added

- Added a GitHub Actions workflow for GitHub Pages deployment.
- Configured the repository to publish the static app from Actions.

### Changed

- Updated the README live demo link to `https://mrmcgrain.github.io/NextChapter/`.

### Verified

- Pushed `main` to GitHub.
- Confirmed the Pages deployment workflow completed successfully.
- Verified the live site returned `200` and contained `Project Launch Planner`.

## 2026-07-05 - Documentation and Prompt History

### Added

- Added a complete README with the required assignment sections:
  - Live demo
  - Problem
  - Value
  - Project plan
  - Completed features
  - Future improvements
  - Technologies used
  - AI tools used
  - Running instructions
- Added `prompt-history.md` with selected prompts showing planning, feature development, documentation, verification, deployment, debugging, and follow-up work.

### Changed

- Kept prompt history updated as new requests were made during development.

## 2026-07-05 - Initial Application Build

### Added

- Created the static Project Launch Planner application with HTML, CSS, and JavaScript.
- Added guided project planning fields for:
  - Project name
  - Target user
  - Problem
  - Value
  - Solution
  - Smallest demonstration of value
- Added required and future feature lists.
- Added README draft generation from the user's project plan.
- Added prompt history tracking inside the app.
- Added a submission checklist with a readiness score.
- Added browser localStorage support for saving planner progress.
- Added responsive desktop and mobile layout.

### Verified

- Confirmed JavaScript syntax with `node --check script.js`.
- Captured Playwright screenshots for desktop and mobile layout checks.

## Current Project State

- Live app: `https://mrmcgrain.github.io/NextChapter/`
- Latest working branch: `feature/localstorage-refresh-fix`
- Main user-facing capabilities:
  - Plan a software project.
  - Track required and future features.
  - Generate a README draft.
  - Record meaningful AI prompts.
- Manage multiple saved project plans.
- Rename saved project plans from the Define the project section.
  - Track submission readiness.
  - Persist saved projects across refreshes.
