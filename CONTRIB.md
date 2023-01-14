Contribution Guide
===

Overview
---

| Component | Library
|--|--
| Program Language | TypeScript
| Front-end | React via Vite.js
| UI Components | Chakra UI
| State Management | Zustand
| Web3 Client | Solana Web3.js & Anchor TypeScript Client
| Code style | Prettier

VS Code is recommended for development. [Workspace settings](.vscode/settings.json) has been configured for consistent style.

Best Practices
--- 

* **Commits:** 
     * Follow strict [Conventional Commits](https://www.conventionalcommits.org/).
     * For community PRs, rewrite the commit message if it does not align, before merging.
     * Merge squash PRs. We don't need to see PR feedback cycle permenantly in commit history.
* ⚠️ **Community pull requests:** Check that there are no changes to GitHub Action workflows before triggering the PR pipelines.
* **Source code structure:**
     * `src/coders`: Coders for encoding/decoding instruction data
     * `src/components`: All React components
     * `src/hooks`: Custom hooks
     * `src/library`: Collection of common instructions, account labels, etc.
     * `src/mappers`: Functions to convert between types
     * `src/types`: Typescript types
     * `src/utils`: Common utility functions
* **Global state:** 
     * Prefer passing down props to children where possible.
     * Use global state as a last resort when the components that read and write it are too far in the component tree.
* **Custom hooks:** If the business logic is getting more complex than a few lines or if it is referenced in multiple places, consider refactoring them into a custom hook, stored in `src/hooks`.
     * If the business logic does not require access to React stuff, consider creating a normal function instead. If it is common enough, place it in `src/utils`.
* **Icons:** Use [Chakra-UI icons](https://chakra-ui.com/docs/components/icon) and fallback to [Font Awesome](https://react-icons.github.io/react-icons/icons?name=fa).

Tips
---

* If it is the first time you have cloned the repo or seeing errors about not finding modules in `generated`, simply run `npm run generate` to generate the necessary files.
    * This is automatically run during `build` and `start`.
    * If you are changing anything in `src/types`, you will need to restart the dev server.    
* If something you have added to the state is not reflecting, try clearing the localstorage cache.