# Commit History

This file summarizes the Git history for Project Launch Planner in reverse chronological order.

## 2026-07-09

### `7b51fd6` - Swap saved project delete and duplicate controls

Moved the Duplicate button before Delete in the saved-project controls so the destructive action appears last.

### `8ee8bfb` - Add saved project delete confirmation

Added a confirmation step before deleting a saved project and updated the related documentation and prompt history.

### `0f4f64d` - Add saved project rename control

Added saved-project rename behavior through the Project name field and refined the saved-project controls.

### `2311635` - Backfill prompt history narrative

Expanded the prompt history into a fuller explanation of project thinking, learning, and decision-making.

### `59dc703` - Add project changelog

Created the project changelog documenting the application from the initial build through later feature and security work.

## 2026-07-05

### `226fd92` - Fix saved project refresh persistence

Fixed the localStorage refresh issue so saved project data is not overwritten on page load.

### `cd2e6d3` - Record persistence push prompt

Recorded the prompt related to pushing the persistent storage work.

### `2215671` - Persist saved project edits automatically

Improved saved-project persistence so edits, prompt entries, checklist updates, and project changes autosave correctly.

### `fb25430` - Harden rendering against XSS

Hardened user-content rendering paths against XSS by avoiding unsafe HTML interpolation.

### `b8d085d` - Harden saved project rendering against XSS

Applied XSS hardening to saved-project rendering and stored user content handling.

### `66ca0d5` - Merge pull request #1 from mrmcgrain/feature/saved-project-switcher

Merged the saved-project switcher feature branch into the main project history.

### `5cbea80` - Record saved-project push prompt

Recorded the prompt related to pushing the saved-project switcher work.

### `5fe3d37` - Add saved project switcher

Added support for multiple saved project plans with project switching, creation, duplication, and deletion.

### `c3fd59b` - Record deployment prompt history

Recorded the prompt history entry for the GitHub Pages deployment work.

### `eaa5600` - Add GitHub Pages deployment workflow

Added the GitHub Actions workflow for publishing the static app to GitHub Pages.

### `de3057b` - Update prompt history with documentation follow-up

Updated prompt history after documentation follow-up work.

### `d79db47` - Add project documentation and prompt history

Added the README and initial prompt-history documentation required for the project.

### `0dd67a9` - Build project launch planner app

Created the first working version of Project Launch Planner with planner sections, feature tracking, README generation, prompt tracking, checklist scoring, and local browser persistence.
