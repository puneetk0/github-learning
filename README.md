# 🐙 The Complete Git & GitHub Mastery Guide

A highly interactive, deeply technical Single Page Application (SPA) designed to take developers from basic `git add .` users to Git Internals masters. 

Built with **React** and **Vite**, this application abandons the standard "wall of text" textbook format in favor of a "Show, Don't Tell" philosophy. It merges Senior-Engineer-level academic depth with interactive sandboxes, visualizers, and branching simulators.

---

## 🎨 Features & Design Philosophy

- **Interactive Simulators:** Every major Git concept (Rebasing, Detached HEAD, Patch Staging, Bisecting) is accompanied by a stateful React component that lets you physically manipulate the concept.
- **Deep Technical Accuracy:** Goes far beyond the surface level, explaining Directed Acyclic Graphs (DAGs), cryptographic hashing, zlib compression, and `diff3` conflict resolution.
- **Brutalist / Dark Mode Aesthetic:** A sleek, developer-focused UI using specialized typography (Montserrat, JetBrains Mono, Nunito Sans) and high-contrast color tokens.
- **Modular Architecture:** The curriculum is split into 14 distinct chapters, easily navigable via a centralized sidebar.

---

## 📁 File & Folder Structure

The application is structured logically to separate high-level page content from reusable interactive components and UI wrappers.

### Root Directory
- `index.html`: The core HTML entry point.
- `vite.config.js`: Vite build and dev server configuration.
- `package.json`: Project dependencies (React, React Router, Lucide Icons).

### `/src` (Core Source Code)
- `main.jsx`: The React DOM rendering entry point.
- `App.jsx`: The main application container. Handles all `react-router-dom` routing and implements the `ScrollToTop` wrapper for seamless navigation.
- `App.css`: Structural layout styling (sidebar grids, main content containers).
- `index.css`: The global Design System. Contains all CSS variables (colors, typography, spacing), brutalist button classes (`.btn`), and global resets.

### `/src/pages` (The 14 Chapters)
Each file in this directory represents a full chapter of the curriculum. They compose UI wrappers, Deep Dives, and Interactive Simulators into a cohesive lesson.

1. **`Intro.jsx`**: Centralized vs Distributed, CAP theorem, GitHub's architecture (Spokes/Gitaly).
2. **`Setup.jsx`**: Config scopes, Conditional Includes, Ed25519 SSH cryptography, and GPG Commit Signing.
3. **`MentalModels.jsx`**: The DAG, the Three Trees (Working, Index, HEAD), and Snapshot Deduplication.
4. **`Internals.jsx`**: The `.git` folder masterclass. Blobs, Trees, Commits, Tags, zlib compression, and Garbage Collection (packfiles).
5. **`Essentials.jsx`**: Surgical staging (`git add -p`), Conventional Commits, and safe pushing (`--force-with-lease`).
6. **`Branching.jsx`**: Fast-forward vs 3-way merges, the Rebase engine, cherry-picking, and worktrees.
7. **`Conflicts.jsx`**: Conflict markers, the `diff3` style, and `git rerere`.
8. **`Advanced.jsx`**: The Stash LIFO stack, automated binary searching with `git bisect`, and `git blame` archaeology.
9. **`Undo.jsx`**: Recovering from mistakes (Hard/Soft/Mixed resets) and the `git reflog`.
10. **`GithubFeatures.jsx`**: Fork & Pull PR architecture, Actions, and Branch Protections.
11. **`Workflows.jsx`**: Trunk-Based Development vs GitFlow vs GitHub Flow.
12. **`BestPractices.jsx`**: Husky hooks, commit hygiene, and repository maintenance.
13. **`StartupPR.jsx`**: A narrative-driven, full-stack workflow simulation.
14. **`Cheatsheet.jsx`**: A searchable, categorized command reference.

### `/src/components` (Interactive Simulators)
The beating heart of the application. These are complex, stateful React components that visualize Git's underlying mechanics.

- `NetworkTopologyVisualizer.jsx`: Simulates Centralized (SVN) vs Distributed (Git) network failures.
- `DetachedHeadExplorer.jsx`: Visualizes how the `HEAD` pointer disconnects from branch references.
- `GitFolderExplorer.jsx`: A file-tree navigator for inspecting raw `.git` internals.
- `CatFileSimulator.jsx`: Simulates `git cat-file`, parsing Tree and Commit object C-structs.
- `InteractivePatchStaging.jsx`: A functional replica of the `git add -p` chunk-selection interface.
- `RebaseVisualizer.jsx`: Animates the process of "lifting" and "replaying" commits during a rebase.
- `ConflictResolver.jsx`: An interactive code editor for fixing `<<<<<<< HEAD` merge conflicts.
- `StashStack.jsx`: Visualizes pushing and popping from the Git LIFO stash.
- `BisectGame.jsx`: A mini-game teaching `log2(N)` binary search bug finding.
- `ResetModeVisualizer.jsx`: Animates the difference between `--soft`, `--mixed`, and `--hard`.
- `UndoDecisionTree.jsx`: An interactive flowchart to find the right "undo" command.
- `PullRequestReviewUI.jsx`: Simulates a GitHub PR code review interface.
- `WorkflowCompare.jsx`: Side-by-side comparison of branching strategies.
- `StartupSimulator.jsx`: A story-based terminal simulator for your first PR.
- `SearchableCheatsheet.jsx`: A real-time filtering engine for Git commands.
- `Sidebar.jsx`: The application's main navigation menu.

### `/src/components/ui` (Design System Wrappers)
Reusable, stateless presentation components to format massive amounts of technical text.

- `Tabs.jsx`: Segments deep-dive content (Basic, Advanced, Internals) to prevent text fatigue.
- `CommandTable.jsx`: Standardized table formatting for exhaustive flag documentation.
- `WarningBox.jsx`: Visually distinct alerts for destructive commands (e.g., `--force`).
- `DeepDive.jsx`: Collapsible accordions for C-level technical details.
- `Callout.jsx`: Highlighted text blocks for important context.
- `CodeBlock.jsx`: Syntax-highlighted blocks representing terminal inputs or file outputs.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port specified by Vite in the terminal).

---

## 🛠 Tech Stack
- **React 18** (Functional Components, Hooks)
- **Vite** (Build Tooling & HMR)
- **React Router v6** (SPA Navigation)
- **Lucide React** (SVG Iconography)
- **Vanilla CSS** (CSS Variables, Flexbox/Grid layouts)
