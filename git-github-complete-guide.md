# The Complete Git & GitHub Mastery Guide

> **The most detailed Git & GitHub reference you'll ever need** — from your first `git init` to advanced team workflows, internals, and real-world startup practices. Every command explained with *why*, *when*, and *real scenarios*.

---

## Table of Contents

1. [Why Git & GitHub?](#1-why-git--github)
2. [Setup & Configuration](#2-setup--configuration)
3. [Core Concepts — The Mental Models](#3-core-concepts--the-mental-models)
4. [Inside the `.git` Folder — Internals](#4-inside-the-git-folder--internals)
5. [Essential Commands](#5-essential-commands)
6. [Branching & Merging](#6-branching--merging)
7. [Merge Conflicts — The Full Guide](#7-merge-conflicts--the-full-guide)
8. [Advanced Git](#8-advanced-git)
9. [Undoing Things — The Complete Taxonomy](#9-undoing-things--the-complete-taxonomy)
10. [GitHub-Specific Features](#10-github-specific-features)
11. [Real-World Workflows](#11-real-world-workflows)
12. [Tips, Best Practices & Gotchas](#12-tips-best-practices--gotchas)
13. [Your First Startup PR — Full Walkthrough](#13-your-first-startup-pr--full-walkthrough)
14. [Quick Reference Cheatsheet](#14-quick-reference-cheatsheet)

---

# 1. Why Git & GitHub?

## The Problem Git Solves

Before Git existed, teams wrote code in one of these painful ways:

- **Email zip files**: `project_final_v3_REAL_FINAL_v2.zip` — you know the drill
- **Shared network drives**: One person edits at a time, no history, no safety net
- **CVS / SVN**: Centralized version control — the server goes down, nobody can work. Merging is a nightmare. Branching is slow and expensive.

Git was created by **Linus Torvalds in 2005** to manage the Linux kernel source code. The Linux kernel has thousands of contributors worldwide — he needed something fast, distributed, and able to handle massive scale. He wrote Git in 10 days.

## What Git Actually Is

Git is a **distributed version control system**. Every word matters:

- **Distributed**: Every developer has the *full* copy of the repository — all history, all branches, everything. There is no single "master server" that must always be online. You can commit, branch, and view history completely offline.
- **Version control**: Git tracks every change to every file over time. You can go back to any point in history.
- **System**: It's software that runs on your machine via the command line (or GUI tools built on top of it).

### The Google Docs Analogy

Think of writing a document in Google Docs. Every change is saved. You can see the version history. Multiple people can edit simultaneously. Now imagine that for code, with far more power:
- You can create "parallel universes" (branches) where you experiment without affecting others
- You can merge two people's work together intelligently
- You can see *who* changed *what* and *why* (via commit messages)
- You can instantly rewind to any past state

## Git vs GitHub — They Are Not the Same Thing

This is one of the most common confusions for beginners.

| | Git | GitHub |
|---|---|---|
| **What it is** | A tool / software | A website / platform |
| **Where it runs** | On your machine | In the cloud (Microsoft's servers) |
| **What it does** | Tracks code changes, manages history, branches | Hosts Git repos online, adds collaboration features |
| **Can you use it offline?** | Yes, completely | No |
| **Alternatives** | Mercurial, SVN, Perforce | GitLab, Bitbucket, Azure DevOps |
| **Created by** | Linus Torvalds, 2005 | Tom Preston-Werner, 2008 |

**The analogy**: Git is the engine. GitHub is the car with all the dashboard, GPS, and connectivity features. You can use Git without GitHub (purely local repos), but GitHub is built entirely on top of Git.

## Why GitHub Specifically?

GitHub became the dominant platform because:
1. **Network effects**: Every developer is already there — open source projects, portfolios, job applications
2. **Pull Requests**: GitHub invented the PR workflow that every team now uses
3. **GitHub Actions**: Free CI/CD built directly into the repo
4. **Community**: Stars, forks, discussions, sponsors — a social layer for code
5. **Integration ecosystem**: Every tool (Jira, Slack, VS Code, Vercel) integrates with GitHub natively

## Who Uses Git?

- **Solo developers**: Version history, safe experimentation, portfolio on GitHub
- **Startups**: Feature branch workflows, PRs, automated deployments via Actions
- **Large companies**: Google, Microsoft, Meta, Amazon — all of their internal code lives in Git repos (often on internal GitHub Enterprise)
- **Open source**: Linux, React, VS Code, Python, TypeScript, Django — every major open source project
- **Non-software teams**: Docs teams, data science teams, legal teams (version-controlling contracts) — Git is expanding beyond code

---

# 2. Setup & Configuration

## Installing Git

### macOS
```bash
# Option 1: Homebrew (recommended)
brew install git

# Option 2: Xcode Command Line Tools (installs many dev tools)
xcode-select --install

# Option 3: Download from git-scm.com
```

### Linux (Debian/Ubuntu)
```bash
sudo apt update
sudo apt install git

# Fedora/RHEL
sudo dnf install git

# Arch
sudo pacman -S git
```

### Windows
Download **Git for Windows** from [git-scm.com](https://git-scm.com). This installs:
- Git itself
- **Git Bash** — a Unix-style terminal emulator. **Use this, not PowerShell or CMD** for Git work. It behaves like the terminal on Mac/Linux.
- Git GUI (optional graphical interface)

### Verify Installation
```bash
git --version
# Should output something like: git version 2.44.0
```

---

## git config — The First Thing You Must Do

Before your very first commit, configure your identity. Git embeds this into every commit you make — and it cannot be changed after the fact without rewriting history.

```bash
# Set your name (this appears in git log, on GitHub, etc.)
git config --global user.name "Your Full Name"

# Set your email (must match your GitHub email for commits to link to your profile)
git config --global user.email "you@example.com"

# Set your default editor (for commit messages, rebase instructions, etc.)
git config --global core.editor "code --wait"     # VS Code
git config --global core.editor "vim"             # Vim
git config --global core.editor "nano"            # Nano (easiest for beginners)

# Set default branch name to 'main' (modern standard — old default was 'master')
git config --global init.defaultBranch main

# Make git output colorized (usually on by default)
git config --global color.ui auto

# Set line ending behavior
git config --global core.autocrlf input    # macOS/Linux
git config --global core.autocrlf true     # Windows
```

### Config Scopes

Git config has three scopes, each overriding the previous:

| Scope | Flag | File Location | Applies To |
|---|---|---|---|
| System | `--system` | `/etc/gitconfig` | All users on the machine |
| Global | `--global` | `~/.gitconfig` | All repos for the current user |
| Local | `--local` | `.git/config` (inside repo) | Only the current repo |

**Practical use**: If you have a work laptop where you have both personal and work GitHub accounts, use `--global` for your personal config and `--local` inside work repos to set your work email.

```bash
# Inside a work repo:
git config --local user.email "you@yourcompany.com"
git config --local user.name "Your Name (Work)"
```

### View Your Config
```bash
git config --list                    # Show all config
git config --list --global           # Show only global
git config user.name                 # Show one value
git config --global --edit           # Open global config in editor
```

### The ~/.gitconfig File

After running the above commands, your `~/.gitconfig` looks like this:

```ini
[user]
    name = Your Name
    email = you@example.com
[core]
    editor = code --wait
    autocrlf = input
[init]
    defaultBranch = main
[color]
    ui = auto
[alias]
    st = status
    co = checkout
    br = branch
    lg = log --oneline --graph --decorate --all
```

---

## SSH Setup — The Right Way to Connect to GitHub

You have two options for authenticating with GitHub:
1. **HTTPS** — uses a username + Personal Access Token (PAT). Works everywhere but requires token management.
2. **SSH** — uses a cryptographic key pair. More secure, no passwords, strongly recommended for daily use.

### Generate an SSH Key
```bash
# Generate a new Ed25519 key (modern, more secure than RSA)
ssh-keygen -t ed25519 -C "your_email@example.com"

# You'll be prompted for a file location (press Enter for default: ~/.ssh/id_ed25519)
# You'll be prompted for a passphrase (optional but recommended — protects key if laptop is stolen)
```

### Add the Public Key to GitHub
```bash
# Copy the public key to clipboard
cat ~/.ssh/id_ed25519.pub

# Or on macOS:
pbcopy < ~/.ssh/id_ed25519.pub
```

Then: **GitHub → Settings → SSH and GPG Keys → New SSH Key** → paste it in.

### Add Key to SSH Agent (so you don't type passphrase every time)
```bash
# Start the ssh-agent
eval "$(ssh-agent -s)"

# Add your key
ssh-add ~/.ssh/id_ed25519

# On macOS, add to Keychain permanently:
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

### Test the Connection
```bash
ssh -T git@github.com
# Should output: Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### Multiple GitHub Accounts (Work + Personal)

Create `~/.ssh/config`:
```
# Personal GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal

# Work GitHub
Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
```

Then clone work repos with: `git clone git@github-work:company/repo.git`

---

## Aliases — Save Keystrokes, Save Your Sanity

Aliases are shortcuts for git commands. Every experienced developer has a set they've built over years.

```bash
# The essentials
git config --global alias.st "status"
git config --global alias.co "checkout"
git config --global alias.br "branch"
git config --global alias.ci "commit"

# The most useful log alias ever — shows a visual branch graph
git config --global alias.lg "log --oneline --graph --decorate --all"

# Even shorter status
git config --global alias.s "status -s"

# Show the last commit
git config --global alias.last "log -1 HEAD --stat"

# Pretty log with author, date, and message
git config --global alias.ll "log --pretty=format:'%C(yellow)%h%Creset %C(green)%ad%Creset | %s%C(red)%d%Creset [%an]' --date=short"

# Undo last commit (keeps changes staged)
git config --global alias.undo "reset --soft HEAD~1"

# Clean up merged branches
git config --global alias.cleanup "!git branch --merged | grep -v '\\*\\|main\\|master\\|develop' | xargs git branch -d"
```

After setting up `git lg`, run it in any repo. You'll see a beautiful ASCII branch graph that shows you the full history at a glance.

---

## .gitignore — What Not to Track

Before your very first `git add .`, create a `.gitignore` file in your project root. This tells Git which files and folders to never track.

```gitignore
# ── Dependencies ──────────────────────────────────
node_modules/
vendor/
.venv/
__pycache__/
*.pyc

# ── Environment & Secrets ─────────────────────────
.env
.env.local
.env.*.local
*.pem
*.key
*.cert
secrets.json

# ── Build Output ──────────────────────────────────
dist/
build/
out/
.next/
.nuxt/
target/

# ── Editor & OS Files ─────────────────────────────
.DS_Store
Thumbs.db
.idea/
.vscode/
*.swp
*~

# ── Logs ──────────────────────────────────────────
*.log
logs/
npm-debug.log*

# ── Testing ───────────────────────────────────────
coverage/
.nyc_output/
```

> **Pro tip**: Use [gitignore.io](https://gitignore.io) — type your stack (e.g., "Node, React, macOS") and it generates the perfect `.gitignore` automatically.

> **If you accidentally committed a secret**: Rotate the secret IMMEDIATELY — it's already compromised. Then remove it from history using `git filter-repo` or BFG Repo Cleaner, and force push.

---

# 3. Core Concepts — The Mental Models

Get these mental models right and all the commands will click into place naturally.

## The Four Areas of Git

Understanding where your files can "live" in Git is the foundation of everything.

```
┌─────────────────┐   git add    ┌──────────────────┐   git commit  ┌──────────────────┐   git push   ┌──────────────────┐
│                 │ ──────────► │                  │ ────────────► │                  │ ───────────► │                  │
│  Working        │              │  Staging Area    │               │  Local           │              │  Remote          │
│  Directory      │              │  (Index)         │               │  Repository      │              │  Repository      │
│                 │ ◄────────── │                  │               │                  │ ◄─────────── │                  │
│  Your files     │  git restore │  Changes ready   │               │  Full history    │  git fetch/  │  GitHub          │
│  on disk        │  --staged    │  to snapshot     │               │  on your machine │  git pull    │  (shared)        │
└─────────────────┘              └──────────────────┘               └──────────────────┘              └──────────────────┘
```

### Working Directory
This is your project folder — the files you see, edit, and run. Changes here are "unstaged" — Git knows about them (if the file is tracked) but hasn't saved them anywhere.

### Staging Area (Index)
A preparation zone. When you run `git add`, you're saying "I want these specific changes in my next commit." This is what makes Git powerful — you can have 10 changed files but only commit 3 of them, creating a clean, focused commit.

**Why staging exists**: It lets you be intentional about what goes into each commit. You might be working on a feature and fix a typo along the way. Stage and commit the typo fix separately. Now your history is clean and bisectable.

### Local Repository
The `.git` folder inside your project. This is where all commits, branches, tags, and history live — entirely on your machine. No internet needed.

### Remote Repository
A copy of your repo hosted somewhere (GitHub, GitLab, etc.). `git push` sends commits from your local repo to the remote. `git pull` brings remote commits to your local repo.

---

## Commits — Snapshots, Not Diffs

This is a critical mental model that many developers get wrong.

**Git does NOT store diffs.** Git stores **complete snapshots** of your entire project at each commit. Internally it's very efficient (uses object deduplication), but conceptually, each commit is a photograph of your entire codebase at that moment.

Each commit contains:
- A **SHA-1 hash** (40 hex characters): the unique fingerprint of that commit, e.g., `a3f2c91d4e8b7f1c2d3e4f5a6b7c8d9e0f1a2b3c`
- The **tree**: a reference to a snapshot of all your files
- The **parent commit(s)**: what came before (merge commits have two parents)
- **Author**: name + email + timestamp of when the code was written
- **Committer**: name + email + timestamp of when the commit was made (can differ from author in some workflows)
- **Message**: your description of what changed and why

### Commit Hashes
You can reference a commit by its full 40-char hash or by the first 7 characters (Git will find the unique match):

```bash
git show a3f2c91                  # Works fine — Git will find the full hash
git checkout a3f2c91d4e8b7f1c    # Also works
```

### Parent Chain = History
Every commit points to its parent. Following those pointers backward gives you your entire history. A merge commit points to two parents — that's how Git represents two branches coming together.

---

## Branches — Lightweight Pointers

A branch is **just a file containing a SHA hash**. That's it. Creating a branch doesn't copy files. It doesn't slow anything down. It's an instant operation that creates a tiny file.

```
Before branching:
A ── B ── C  ← main (a pointer to commit C)

After git checkout -b feature:
A ── B ── C  ← main
              ↑
              feature  (both pointing to the same commit C)

After 2 commits on feature:
A ── B ── C ──── D ── E  ← feature (HEAD)
              ↑
              main
```

This is why Git branching is so much faster than older systems like SVN — it's free.

### HEAD — Where You Are Right Now

`HEAD` is a special pointer that points to your current location. Usually it points to a branch name (which in turn points to a commit). When you commit, HEAD and the branch both advance to the new commit.

```bash
cat .git/HEAD
# Outputs: ref: refs/heads/main
# This means: HEAD is pointing to the 'main' branch

# After git checkout a3f2c91 (a specific commit):
cat .git/HEAD
# Outputs: a3f2c91d4e8b7f1c...
# This is "detached HEAD" — HEAD points directly to a commit, not a branch
```

### Detached HEAD State

You enter detached HEAD when you check out a specific commit (not a branch). You can look around, run the code, even make commits — but those commits won't be attached to any branch and can be lost if you switch away.

```bash
# To get out of detached HEAD:
git checkout main                    # Go back to main (losing your detached commits)
git checkout -b rescue-branch       # Save detached commits to a new branch
```

---

## Remotes — Your GitHub Connection

A remote is a named URL pointing to another copy of your repo. By convention, the first remote is called `origin`.

```bash
git remote -v
# origin  git@github.com:you/your-repo.git (fetch)
# origin  git@github.com:you/your-repo.git (push)

git remote add upstream git@github.com:original/repo.git
# Now you have two remotes: origin (your fork) and upstream (original)
```

### Remote-Tracking Branches

When you fetch from a remote, Git creates local references like `origin/main`, `origin/feature`. These are snapshots of where those branches were last time you talked to the remote — they don't update in real time.

```bash
git fetch origin           # Update all remote-tracking branches
git branch -r              # Show remote-tracking branches
git log origin/main        # See what main looks like on the remote
```

---

## Tags — Named Commits

Tags are references to specific commits that don't move. Used for releases.

```bash
# Lightweight tag (just a pointer)
git tag v1.0.0

# Annotated tag (has its own message, author, date — recommended for releases)
git tag -a v1.0.0 -m "First stable release"

git push origin v1.0.0     # Push a specific tag
git push origin --tags     # Push all tags
```

---

# 4. Inside the `.git` Folder — Internals

Most developers use Git for years without looking inside `.git`. The moment you do, all the "magic" demystifies completely. This section is what separates developers who use Git from developers who understand Git.

## The Folder Structure

```
.git/
├── HEAD                    ← Where you are right now (branch ref or commit hash)
├── config                  ← Repo-local git config (overrides ~/.gitconfig)
├── description             ← Only used by GitWeb — ignore this
├── COMMIT_EDITMSG          ← The message from the last commit you made
├── MERGE_HEAD              ← Exists during a merge (points to the incoming branch's tip)
├── MERGE_MSG               ← Auto-generated merge commit message
├── REBASE_HEAD             ← Exists during a rebase
├── index                   ← The staging area (binary file)
│
├── objects/                ← Every piece of data Git has ever stored
│   ├── ab/                 ← Subdirectory named by first 2 chars of hash
│   │   └── cdef1234...    ← The actual object file (compressed with zlib)
│   ├── info/
│   └── pack/               ← Packfiles: compressed collections of objects
│
├── refs/
│   ├── heads/              ← Local branches
│   │   ├── main            ← Contains the SHA of main's tip commit
│   │   └── feature/login   ← Contains the SHA of that branch's tip commit
│   ├── tags/               ← Your tags
│   │   └── v1.0.0
│   └── remotes/
│       └── origin/
│           ├── main        ← Remote-tracking branches
│           └── HEAD
│
└── logs/
    ├── HEAD                ← The reflog for HEAD (every position HEAD has been)
    └── refs/
        └── heads/
            └── main        ← The reflog for the main branch
```

## The Four Object Types

Everything in Git is stored as one of four object types. They're all stored as compressed files in `.git/objects/`, named by their SHA hash.

### 1. Blob (Binary Large Object)
Stores the contents of a file. Just the raw content — no filename, no permissions, nothing else.

```bash
# See the type and content of any object
git cat-file -t a1b2c3d    # Shows: blob / tree / commit / tag
git cat-file -p a1b2c3d    # Shows the content of the object
```

### 2. Tree
Represents a directory. Contains a list of blobs and other trees with their filenames and permissions.

```bash
git cat-file -p HEAD^{tree}
# Outputs:
# 100644 blob a1b2c3d    README.md
# 100644 blob e4f5g6h    package.json
# 040000 tree i7j8k9l    src
```

### 3. Commit
Points to a tree (the state of your project) plus metadata: parent commit(s), author, committer, message.

```bash
git cat-file -p HEAD
# Outputs:
# tree 9d8e7f6a...
# parent c5d4e3f2...
# author Alice <alice@example.com> 1710518400 +0000
# committer Alice <alice@example.com> 1710518400 +0000
#
# feat: add payment processing
```

### 4. Tag
An annotated tag object — points to a commit with additional metadata (tagger, message, date).

---

## HEAD in Detail

```bash
cat .git/HEAD
# ref: refs/heads/main        ← Normal state: HEAD → branch → commit

cat .git/refs/heads/main
# a3f2c91d4e8b7f1c...         ← Branch is just a file with a commit hash

# Chain: HEAD → refs/heads/main → a3f2c91d (the actual commit)
```

When you run `git commit`, Git:
1. Creates a new commit object in `.git/objects/`
2. Updates `.git/refs/heads/main` to point to the new commit hash
3. Updates `.git/logs/HEAD` with the new position

That's literally it. No magic.

## The Index (Staging Area)

`.git/index` is a binary file that represents the staging area. Every time you run `git add`, Git updates this file. You can inspect it:

```bash
git ls-files --stage
# 100644 a1b2c3d 0    README.md
# 100644 e4f5g6h 0    src/index.js
# The number (0) is the "stage number" — during a merge conflict it becomes 1, 2, or 3
```

## Packfiles

Over time, `.git/objects/` can accumulate thousands of loose object files. Git periodically runs garbage collection (`git gc`) to pack them into **packfiles** — compressed binary archives. This dramatically reduces disk space.

```bash
git gc                  # Manual garbage collection and repack
git count-objects -v    # See how many loose objects vs packed objects you have
```

---

## Why This Matters Practically

Once you understand `.git` internals:

- **`git reset HEAD~1`** makes sense: it literally moves the pointer in `.git/refs/heads/main` backward one step.
- **`git branch new-branch`** makes sense: it creates a new file in `.git/refs/heads/` containing the current commit hash.
- **Detached HEAD** makes sense: `.git/HEAD` contains a raw hash instead of `ref: refs/heads/branchname`.
- **You lose commits in detached HEAD** makes sense: nothing points to those commits — they're orphaned objects that will eventually be garbage collected.
- **`git reflog` can recover "lost" commits** makes sense: it reads `.git/logs/HEAD`, which records every position HEAD has ever been.

```bash
# Try these on any repo to see the internals live:
cat .git/HEAD
cat .git/refs/heads/main
git cat-file -t HEAD
git cat-file -p HEAD
git ls-files --stage | head -20
```

---

# 5. Essential Commands

Every command below includes: what it does, a real-world scenario, the syntax, key flags, and things to watch out for.

## git init

**What it does**: Initializes a new empty Git repository in the current directory by creating the `.git` folder.

**When to use**: Once per project, at the very beginning.

```bash
# Initialize in current directory
git init

# Initialize in a new directory (creates the directory too)
git init my-project

# Initialize a bare repository (for hosting — no working directory)
git init --bare repo.git
```

**What happens**: Creates `.git/` with the skeleton structure. No commits exist yet. You're on the default branch (usually `main`) but it doesn't exist yet either — it will be created on your first commit.

> **Real scenario**: You just created a new folder and wrote some initial code. Before you do anything else, run `git init` and create a `.gitignore`.

---

## git clone

**What it does**: Copies a remote repository to your local machine — including all history, all branches, and all tags.

**When to use**: When you want to work on an existing repository (joining a team, contributing to open source, etc.).

```bash
# Clone via SSH (recommended — uses your SSH key)
git clone git@github.com:username/repo.git

# Clone via HTTPS
git clone https://github.com/username/repo.git

# Clone into a specific folder name
git clone git@github.com:username/repo.git my-folder-name

# Shallow clone — only get the latest commit (much faster for large repos)
git clone --depth 1 git@github.com:username/repo.git

# Clone only a specific branch
git clone --branch feature/login --single-branch git@github.com:username/repo.git

# Clone including all submodules
git clone --recurse-submodules git@github.com:username/repo.git
```

**What happens automatically**: Git clones the repo, sets up `origin` as the remote pointing to the URL you cloned from, and checks out the default branch.

> **Real scenario**: Day 1 at a new startup. Your tech lead sends you the GitHub repo URL. You `git clone` it and you have the entire codebase, all history, all branches — in seconds.

> **Pro tip**: On large repos (like VS Code or Linux kernel), use `--depth 1` for the initial clone. You save gigabytes of download and minutes of waiting. Deepen later if you need history: `git fetch --unshallow`.

---

## git status

**What it does**: Shows the current state of your working directory and staging area — what's been modified, what's staged, what's untracked.

**When to use**: Constantly. Run it before and after every operation. It costs nothing.

```bash
git status                 # Full output
git status -s              # Short format (more compact)
git status -sb             # Short format + branch info
```

**Understanding the output**:
```
On branch feature/login
Your branch is ahead of 'origin/feature/login' by 2 commits.

Changes to be committed:               ← STAGED (will go into next commit)
  (use "git restore --staged <file>..." to unstage)
        modified:   src/auth.js

Changes not staged for commit:         ← MODIFIED but not staged
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/user.js

Untracked files:                       ← NEW files Git has never seen
  (use "git add <file>..." to include in what will be committed)
        src/payments.js
```

**Short format (`-s`) output**:
```
M  src/auth.js       ← Staged (green M in left column)
 M src/user.js       ← Modified, not staged (red M in right column)
?? src/payments.js   ← Untracked
A  src/new-file.js   ← Newly added (staged)
D  src/old.js        ← Deleted (staged)
```

---

## git add

**What it does**: Stages changes — moves them from the working directory to the staging area, preparing them for the next commit.

**When to use**: After editing files, before committing. This is where you choose *which* changes go into the next commit.

```bash
# Stage a specific file
git add src/auth.js

# Stage multiple files
git add src/auth.js src/user.js

# Stage all changes in current directory and subdirectories
git add .

# Stage all changes everywhere in the repo (from any subdirectory)
git add -A

# Stage only modified/deleted files (NOT new untracked files)
git add -u

# Interactive patch staging — choose individual "hunks" within files
git add -p

# Interactively choose files and hunks
git add -i
```

### git add -p — The Power Move

`git add -p` (patch mode) shows you each chunk of changes and asks what to do:
```
Stage this hunk [y,n,q,a,d,s,?]?
y - stage this hunk
n - do not stage this hunk
s - split this hunk into smaller hunks
e - manually edit this hunk
q - quit; do not stage this or any remaining hunks
? - print help
```

> **Real scenario**: You fixed a bug AND refactored a function in the same file. Use `git add -p` to stage only the bug fix lines, commit them separately, then stage and commit the refactor. Your history is clean and every commit does one thing.

> **Warning**: `git add .` stages everything including files you might not want to commit (build artifacts, temp files, `.env`). Always have a `.gitignore` set up first, and review with `git status` after staging.

---

## git commit

**What it does**: Creates a new commit — a permanent snapshot of everything in the staging area.

**When to use**: Whenever you've reached a logical checkpoint. Commit small and often, not in big dumps at end of day.

```bash
# Commit with inline message
git commit -m "feat: add OAuth2 login with Google"

# Commit with multi-line message (opens editor)
git commit

# Stage all tracked modified files AND commit in one command
# (skips staging — don't use when you need selective staging)
git commit -am "fix: handle null user in session"

# Amend the last commit (change message or add forgotten files)
# ONLY use before pushing
git commit --amend

# Amend without changing the message
git commit --amend --no-edit

# Create an empty commit (useful for triggering CI, marking events)
git commit --allow-empty -m "chore: trigger deployment"
```

### Writing Good Commit Messages

This is one of the most undervalued skills. Good commit messages are documentation. You're writing notes for:
- **Your future self** ("why did I do this?")
- **Your teammates** during code review
- **Whoever is debugging** this code in 2 years

**The Conventional Commits standard** (used by most professional teams):

```
<type>(<optional scope>): <short description>

<optional longer body>

<optional footer: Closes #123, Breaking changes, etc.>
```

| Type | When to use |
|---|---|
| `feat` | New feature or behavior |
| `fix` | Bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code restructure (no new feature or bug fix) |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `chore` | Build system, dependency updates, tooling |
| `ci` | CI/CD configuration changes |
| `revert` | Reverting a previous commit |

**Good commit messages**:
```
feat(auth): add JWT refresh token rotation

Implements silent token refresh before expiry to prevent session drops.
Refresh tokens are stored in HttpOnly cookies, access tokens in memory.

Closes #142
```

**Bad commit messages**:
```
fix stuff
wip
update
asdfgh
fixed the bug from yesterday
```

**Subject line rules**:
- 50 characters or less
- Imperative mood: "Add feature" not "Added feature" or "Adding feature"
- No period at the end
- Capitalize the first letter

---

## git push

**What it does**: Uploads your local commits to a remote repository.

**When to use**: After committing, to share your work with teammates or back it up to GitHub.

```bash
# Push current branch to its remote counterpart
git push

# Push a specific branch to origin
git push origin main

# Push and set the upstream tracking branch (first push of a new branch)
git push -u origin feature/login

# Push all local branches
git push --all origin

# Push all tags
git push origin --tags

# Push a specific tag
git push origin v1.2.0

# Delete a remote branch
git push origin --delete feature/old-branch
git push origin :feature/old-branch        # Alternative syntax

# Safe force push (only if nobody else pushed since you last fetched)
git push --force-with-lease

# Dangerous force push (NEVER on shared branches)
git push --force
git push -f
```

### Force Push — When and How

`--force` rewrites remote history. This is:
- ✅ **Acceptable**: After a rebase on your own private feature branch (only you are working on it)
- ✅ **Acceptable**: Fixing a commit before anyone else has pulled
- ❌ **Never**: On `main`, `develop`, or any branch other developers are using

Always use `--force-with-lease` instead of `--force`. It adds a safety check: the push fails if someone else pushed after you last fetched, preventing you from overwriting their work.

```bash
# Safe: fails if remote has been updated
git push --force-with-lease origin feature/my-branch

# Dangerous: overwrites whatever is there, no questions asked
git push -f origin feature/my-branch
```

---

## git pull

**What it does**: Downloads changes from the remote AND integrates them into your current branch. It's a combination of `git fetch` + `git merge` (or `git fetch` + `git rebase` if configured).

**When to use**: At the start of every working session. Before opening a PR. Before pushing.

```bash
# Pull and merge (default)
git pull

# Pull and rebase instead of merge (cleaner history)
git pull --rebase

# Pull from a specific remote and branch
git pull origin main

# Pull with rebase from specific branch
git pull --rebase origin main

# Pull all branches and tags but don't integrate
git fetch --all

# See what would be pulled without actually pulling
git fetch && git log HEAD..origin/main --oneline
```

### git pull vs git fetch — An Important Distinction

```
git fetch:
  Downloads remote changes → updates remote-tracking branches (origin/main)
  Does NOT touch your working directory or current branch
  Safe to run at any time

git pull = git fetch + git merge:
  Downloads remote changes AND immediately merges them into your current branch
  Changes your working directory
  Can cause merge conflicts
```

**When to use fetch vs pull**:
- Use `git fetch` when you want to see what changed on the remote before deciding what to do
- Use `git pull --rebase` as your default daily sync command
- Use bare `git pull` when you're okay with merge commits in your history

### Configuring pull to always rebase
```bash
git config --global pull.rebase true
# Now 'git pull' always does a rebase instead of merge
```

---

## git fetch

**What it does**: Downloads objects and refs from a remote without modifying your working directory or current branch.

```bash
git fetch origin                      # Fetch all branches from origin
git fetch origin main                 # Fetch only main
git fetch --all                       # Fetch from all remotes
git fetch --prune                     # Also delete remote-tracking branches that no longer exist

# See what was fetched
git log HEAD..origin/main --oneline   # Commits on origin/main that you don't have locally
git diff HEAD origin/main             # See the diff
```

---

## git log

**What it does**: Shows the commit history.

**When to use**: To understand what happened, who changed what, when a bug was introduced, what your branch looks like.

```bash
# Default (verbose, shows full messages)
git log

# One line per commit
git log --oneline

# Visual branch graph
git log --oneline --graph --all --decorate

# Show N most recent commits
git log -5
git log -5 --oneline

# Filter by author
git log --author="Alice"
git log --author="alice@example.com"

# Filter by date
git log --since="2024-01-01"
git log --until="2024-06-01"
git log --since="2 weeks ago"
git log --since="yesterday"

# Filter by commit message
git log --grep="payment"
git log --grep="feat" --grep="fix" --all-match  # Must match all patterns

# Show commits that changed a specific file
git log -- src/auth.js
git log --follow -- src/auth.js     # Follow renames

# Show full diff for each commit
git log -p

# Show stats (files changed, insertions, deletions)
git log --stat
git log --shortstat

# Search for commits that added/removed a specific string (the "pickaxe")
git log -S "function getUserById"

# Search for commits that changed a specific regex
git log -G "getUserBy.*"

# Show commits between two references
git log main..feature/login          # Commits in feature/login but not in main
git log v1.0..v2.0 --oneline        # Commits between two tags

# Pretty custom format
git log --pretty=format:"%h %an %ar - %s"
# %h = short hash, %an = author name, %ar = relative date, %s = subject
```

---

## git diff

**What it does**: Shows differences between various states — unstaged changes, staged changes, commits, branches.

```bash
# Unstaged changes (working directory vs staging area)
git diff

# Staged changes (staging area vs last commit — what will be in the next commit)
git diff --staged
git diff --cached    # Same thing

# Difference between two commits
git diff a1b2c3d e4f5g6h

# Difference between two branches
git diff main..feature/login

# Difference between local and remote
git diff HEAD origin/main

# Difference for a specific file only
git diff src/auth.js

# Stat summary (which files changed and how much)
git diff --stat

# Word-level diff (more precise than line-level)
git diff --word-diff
```

---

## git show

**What it does**: Shows information about any Git object — commits, tags, blobs, trees.

```bash
# Show the last commit (diff + message)
git show

# Show a specific commit
git show a1b2c3d

# Show a specific file at a specific commit
git show a1b2c3d:src/auth.js

# Show just the commit message, no diff
git show --no-patch a1b2c3d

# Show a tag
git show v1.0.0
```

---

## git rm and git mv

```bash
# Remove a file from both working directory and staging
git rm src/old-file.js

# Remove from Git tracking but keep the file on disk
git rm --cached src/sensitive-config.js
# Useful when you accidentally committed something that should be gitignored

# Move / rename a file (Git tracks this as a rename)
git mv src/auth.js src/authentication.js
# Equivalent to: mv + git rm + git add
```

---
# 6. Branching & Merging

## Why Branches?

Branches are the feature that makes Git the tool it is. Without branches, every developer would be modifying the same codebase simultaneously — chaos. With branches:

- You develop a feature in isolation. Main is always stable.
- You can switch between tasks instantly (stash your work, switch branches)
- You can experiment — if it fails, just delete the branch
- Code review happens on branches before anything touches main

**The cost of a branch in Git**: Creating a branch is creating a 41-byte file. It's instant. It costs nothing. This is fundamentally different from older VCS systems where branching was expensive.

---

## git branch

**What it does**: Creates, lists, renames, and deletes branches.

```bash
# List all local branches (* marks current)
git branch

# List all local AND remote-tracking branches
git branch -a

# List only remote-tracking branches
git branch -r

# List with additional info (last commit on each branch)
git branch -v

# List merged branches (safe to delete)
git branch --merged

# List unmerged branches (not yet merged into current branch)
git branch --no-merged

# Create a new branch (doesn't switch to it)
git branch feature/payments

# Create a branch pointing to a specific commit
git branch recovery-branch a3f2c91

# Rename the current branch
git branch -m new-name

# Rename a specific branch
git branch -m old-name new-name

# Delete a merged branch (safe)
git branch -d feature/payments

# Force delete (even if not merged)
git branch -D feature/payments
# Use after squash merges — the commits exist on main but Git doesn't recognize the merge

# Set/change the upstream tracking branch
git branch -u origin/main
git branch --set-upstream-to=origin/main
```

### Branch Naming Conventions

Consistency in branch naming is a team discipline that prevents confusion. Common conventions:

```
feature/user-authentication
feature/stripe-integration
fix/null-pointer-on-logout
fix/JIRA-1234-payment-gateway-timeout
hotfix/critical-sql-injection
release/v2.1.0
chore/upgrade-nodejs-18
docs/update-api-readme
test/add-payment-unit-tests
refactor/extract-auth-middleware
experiment/new-caching-strategy
```

Most companies enforce this through documentation or pre-commit hooks. Some use their issue tracker ID: `feature/PROJ-1234-description`.

---

## git checkout / git switch

**What it does**: Switches between branches. `git switch` (added in Git 2.23) does the same thing but with a cleaner, more focused interface.

```bash
# Switch to an existing branch
git checkout main
git switch main             # Modern equivalent

# Create a new branch AND switch to it (most common operation)
git checkout -b feature/payments
git switch -c feature/payments     # Modern equivalent

# Create from a specific starting point (not current HEAD)
git checkout -b feature/new main           # Start from main
git checkout -b hotfix origin/main         # Start from remote main
git switch -c hotfix --track origin/main   # Same, with explicit tracking

# Go back to the previous branch (like cd -)
git checkout -
git switch -

# Discard ALL unstaged changes in working directory (DESTRUCTIVE)
git checkout .

# Restore a specific file to its state at last commit
git checkout -- src/auth.js
git restore src/auth.js          # Modern equivalent (cleaner intent)
```

### The Old `checkout` vs New `switch`/`restore`

Git 2.23 split `git checkout` into two focused commands:
- `git switch`: for switching and creating branches
- `git restore`: for discarding changes to files

Both the old and new syntax work. The new commands are clearer about intent:

```bash
# Old way (all through checkout)
git checkout feature/login          # Switch branch
git checkout -b feature/payments    # Create + switch
git checkout -- src/file.js        # Discard file changes
git checkout HEAD~2 -- src/file.js # Restore file from old commit

# New way (split by concern)
git switch feature/login
git switch -c feature/payments
git restore src/file.js
git restore --source=HEAD~2 src/file.js
```

---

## git merge

**What it does**: Integrates changes from one branch into another by creating a merge commit (or fast-forwarding).

```bash
# Standard workflow: switch to target, then merge source into it
git checkout main
git merge feature/login

# Merge with explicit no-fast-forward (always creates merge commit)
git merge --no-ff feature/login

# Squash all commits into a single staged change (doesn't commit automatically)
git merge --squash feature/login
git commit -m "feat: add login feature"    # You write the final commit message

# Abort a merge in progress (if you have conflicts and want to bail out)
git merge --abort

# Merge only if fast-forward is possible (fail otherwise)
git merge --ff-only origin/main
```

### Fast-Forward vs Three-Way Merge

**Fast-Forward Merge**:
```
Before:
A ── B ── C  ← main
              ↑
              feature (2 extra commits: D, E)

Feature has D, E after C. Main hasn't moved.
Git can simply move main's pointer to E.

After (fast-forward):
A ── B ── C ── D ── E  ← main (and feature)

No merge commit. Linear history.
```

**Three-Way Merge** (when main has moved too):
```
Before:
A ── B ── C ── F ── G  ← main (G is newer than C)
          └── D ── E   ← feature

Git needs to find the common ancestor (C), then combine
the changes from both sides into a new merge commit M.

After:
A ── B ── C ── F ── G ──── M  ← main
          └── D ── E ─────/

M is the merge commit. Two parents: G and E.
```

### Merge Strategies: Which to Use When?

| Strategy | Command | When to use |
|---|---|---|
| Fast-forward | `git merge` (default when possible) | Simple updates, keeping linear history |
| No-fast-forward | `git merge --no-ff` | Preserving that a feature existed as a branch |
| Squash | `git merge --squash` | Condensing messy WIP commits into one clean commit |
| Rebase then merge | `git rebase main && git merge --ff-only` | Cleanest linear history |

---

## git rebase

**What it does**: Moves or replays commits from one branch onto another base. Creates a cleaner, linear history instead of merge commits.

**The mental model**: Imagine you have feature commits on top of an old commit from main. Rebase "lifts" those commits and "replays" them on top of the latest main commit, as if you had started your feature branch today.

```bash
# Rebase current branch onto main
# (replays your commits on top of the latest main)
git rebase main

# Rebase onto a remote branch (sync before PR)
git rebase origin/main

# Interactive rebase — edit the last N commits
git rebase -i HEAD~3     # Edit last 3 commits
git rebase -i HEAD~10    # Edit last 10 commits

# Rebase onto a specific commit
git rebase a3f2c91

# Continue after resolving a conflict
git rebase --continue

# Skip the current conflicting commit (carefully)
git rebase --skip

# Abort the entire rebase, go back to pre-rebase state
git rebase --abort
```

### Interactive Rebase — The Most Powerful Git Feature

`git rebase -i HEAD~N` opens your editor with a list of the last N commits:

```
pick a1b2c3d feat: add user model
pick e4f5g6h wip: half done form
pick i7j8k9l fix: typo
pick m1n2o3p fix: null check
pick q5r6s7t refactor: clean up

# Commands:
# p, pick   = use commit as-is
# r, reword = use commit, but edit the commit message
# e, edit   = use commit, but stop for amending
# s, squash = melt into previous commit, combine messages
# f, fixup  = melt into previous commit, discard this message
# d, drop   = remove this commit entirely
# x, exec   = run command after this commit
```

**Common operations**:

```
# Squash 5 WIP commits into one:
pick a1b2c3d feat: add user model
f e4f5g6h wip: half done form    ← fixup: merge silently
f i7j8k9l fix: typo              ← fixup: merge silently
f m1n2o3p fix: null check        ← fixup: merge silently
r q5r6s7t refactor: clean up     ← reword: will prompt for new message

# Reorder commits (just rearrange the lines)
pick m1n2o3p fix: null check     ← moved before refactor
pick a1b2c3d feat: add user model

# Drop a commit (delete the line or use 'd')
drop e4f5g6h wip: half done form
```

### The Golden Rule of Rebase

> **Never rebase commits that have already been pushed to a shared branch.**

Rebase rewrites history — it creates new commits with different hashes, even if the content is the same. If someone else has pulled your original commits and you rebase and force-push, their history diverges from yours and the next pull will be a nightmare.

✅ Safe to rebase:
- Local commits you haven't pushed
- Commits on your own personal feature branch that only you are working on

❌ Never rebase:
- Commits on `main`, `develop`, or any shared branch
- Commits other people have already pulled

---

## git cherry-pick

**What it does**: Applies the changes introduced by a specific commit onto the current branch, creating a new commit with the same changes but a different hash.

**When to use**: You need a specific fix from one branch applied to another without merging everything.

```bash
# Apply a single commit
git cherry-pick a3f2c91

# Apply a range of commits (exclusive of first, inclusive of last)
git cherry-pick a3f2c91..f8b3a20

# Apply a range (inclusive of both)
git cherry-pick a3f2c91^..f8b3a20

# Apply without automatically committing (stage changes for review)
git cherry-pick -n a3f2c91
git cherry-pick --no-commit a3f2c91

# Continue after resolving a conflict
git cherry-pick --continue

# Abort the cherry-pick
git cherry-pick --abort
```

> **Real scenario**: A security patch was committed to `develop` but production runs `v2.1-stable`. You can't merge all of develop into stable — it has unfinished features. Cherry-pick just the security fix commit onto the stable branch.

> **Watch out**: Cherry-pick creates a duplicate commit — the same change exists in two places in history with different hashes. This can cause confusion during future merges. Use sparingly.

---

## git worktree

An underused but powerful feature. Allows you to have multiple branches checked out simultaneously in different directories.

```bash
# Create a new worktree for a branch
git worktree add ../hotfix-dir hotfix/critical-bug

# List all worktrees
git worktree list

# Remove a worktree
git worktree remove ../hotfix-dir
```

> **Real scenario**: You're in the middle of a feature (50+ changed files), and a critical bug needs immediate attention. Instead of stashing everything, create a worktree — a separate directory where you can work on the hotfix with a clean state, while your feature changes remain untouched in the original directory.

---

# 7. Merge Conflicts — The Full Guide

Merge conflicts are not failures. They are Git saying: "Two people changed the same part of the same file. I don't know which version is correct. Please decide."

Every developer faces conflicts regularly. The ability to resolve them quickly and correctly is a core professional skill.

## When Do Conflicts Happen?

Conflicts occur when Git is trying to merge two branches and finds that:
1. Both branches modified the **same lines** in the same file, OR
2. One branch modified a file that the other branch deleted

Git can auto-merge changes that touch *different parts* of the same file. Only same-line changes cause conflicts.

## Anatomy of a Conflict

When Git detects a conflict, it modifies the file to show you both versions:

```javascript
function getUser(id) {
<<<<<<< HEAD
  // Your branch's version
  return db.findUser(id);
=======
  // Incoming branch's version
  return await userService.getById(id);
>>>>>>> feature/user-service-refactor
}
```

The markers:
- `<<<<<<< HEAD` — Start of YOUR current branch's version
- `=======` — The divider between the two versions
- `>>>>>>> branch-name` — End of the INCOMING branch's version

The file is broken until you resolve this — no app will run, no tests will pass.

## Full Resolution Workflow

### Step 1: Detect the conflict

```bash
git merge feature/user-service-refactor
# Auto-merging src/user.js
# CONFLICT (content): Merge conflict in src/user.js
# Automatic merge failed; fix conflicts and then commit the result.

git status
# Both modified: src/user.js
```

### Step 2: Open the conflicted file(s)

Open every file marked "both modified" in your editor. VS Code shows them with orange indicators and helpful buttons:
- **Accept Current Change**: Keep HEAD version
- **Accept Incoming Change**: Keep the incoming version
- **Accept Both Changes**: Keep both (useful for additive changes)
- **Compare Changes**: Side-by-side diff

### Step 3: Resolve each conflict

You have three options:
1. **Keep your version** (delete everything from `=======` to `>>>>>>> `)
2. **Keep their version** (delete everything from `<<<<<<< ` to `=======`)
3. **Keep both or combine manually** (write new code that incorporates both changes)

After resolution, the file should look like valid, runnable code:
```javascript
function getUser(id) {
  // Chosen: async version with error handling
  return await userService.getById(id);
}
```

**No conflict markers (`<<<`, `===`, `>>>`) should remain in the file.**

### Step 4: Mark as resolved and commit

```bash
# Mark each resolved file
git add src/user.js

# Check if all conflicts are resolved
git status
# All conflicts fixed but you are still merging.
# (use "git commit" to conclude merge)

# Complete the merge
git commit
# Git pre-fills the message: "Merge branch 'feature/user-service-refactor'"
# Save and close the editor
```

### Step 5: Verify

```bash
# Make sure the app still runs
npm start   # or your equivalent

# Run tests
npm test
```

## Conflict Resolution Tools

```bash
# Open the built-in merge tool (uses your configured editor)
git mergetool

# Use a specific tool
git mergetool --tool=vimdiff
git mergetool --tool=code    # VS Code

# Configure your merge tool
git config --global merge.tool code
git config --global mergetool.code.cmd "code --wait $MERGED"
```

## Aborting a Merge

If you get into a conflict and decide this merge is a bad idea right now:

```bash
git merge --abort
# Puts everything back to exactly the state before you started the merge
```

## Conflicts During Rebase

Rebase conflicts are similar but happen one commit at a time:

```bash
git rebase main
# CONFLICT in src/auth.js

# Fix the conflict...
git add src/auth.js

# Continue to the next commit in the rebase
git rebase --continue

# If another conflict appears for the next commit, repeat
# If you want to stop the whole rebase:
git rebase --abort
```

The key difference: during a rebase, you may have to resolve conflicts multiple times (once per commit being replayed that has a conflict). During a merge, you resolve all conflicts at once.

## Preventing Conflicts Proactively

1. **Pull frequently**: The longer you go without syncing with main, the bigger the divergence. Pull (or rebase onto) main every day.
2. **Keep PRs small**: Large PRs that live for weeks accumulate conflicts. Merge small, merge often.
3. **Communicate**: "I'm refactoring `auth.js` today" — tell your team, they'll avoid touching it.
4. **Modular code**: Conflicts happen on the same lines. Well-separated modules have fewer conflicts.
5. **Use feature flags**: Instead of long-lived feature branches, merge incomplete features behind a flag.

## Understanding Conflict Stage Numbers

During a conflict, `git ls-files --stage` shows three versions of the conflicted file:

```
100644 aaa...  1  src/user.js    ← Stage 1: Common ancestor (before both branches diverged)
100644 bbb...  2  src/user.js    ← Stage 2: Your version (HEAD)
100644 ccc...  3  src/user.js    ← Stage 3: Their version (incoming)
```

You can extract any version:
```bash
git checkout --ours src/user.js      # Take stage 2 (your version entirely)
git checkout --theirs src/user.js    # Take stage 3 (their version entirely)
git add src/user.js                  # Mark as resolved
```

This is useful when you know 100% that one version is correct and you don't need to combine them.

---

# 8. Advanced Git

## git stash

**What it does**: Saves your uncommitted changes (both staged and unstaged) to a temporary stack and cleans your working directory — like shoving work under your desk to deal with an emergency.

```bash
# Stash everything (tracked files only)
git stash

# Stash with a descriptive name
git stash push -m "half-done payment form refactor"

# Stash including untracked (new) files
git stash --include-untracked
git stash -u

# Stash including untracked AND ignored files
git stash --all

# List all stashes
git stash list
# stash@{0}: On feature/payments: half-done payment form refactor
# stash@{1}: WIP on main: a3f2c91 fix: null check

# Apply most recent stash (and remove it from the list)
git stash pop

# Apply most recent stash (keep it in the list)
git stash apply

# Apply a specific stash
git stash apply stash@{2}
git stash pop stash@{1}

# Create a branch from a stash (useful if the stash now conflicts with current code)
git stash branch new-feature-branch stash@{0}

# Show what's in a stash (diff)
git stash show
git stash show -p              # Full diff
git stash show -p stash@{1}   # Diff of specific stash

# Delete a specific stash
git stash drop stash@{1}

# Delete all stashes
git stash clear
```

> **Real scenario**: Your manager pings you at 2pm — production login is broken, fix it now. You're 3 hours into a complex feature. `git stash` saves your work, you checkout main, fix the bug, push, and `git stash pop` brings everything back.

> **Pro tip**: Name your stashes. `git stash push -m "WIP: integrating stripe webhooks"` is far better than the default message, especially if you have multiple stashes.

---

## git reflog

**What it does**: Shows a log of every position HEAD has been — every checkout, commit, reset, merge, rebase. This is Git's secret diary and your ultimate recovery tool.

```bash
# Show the full reflog
git reflog

# Show reflog for a specific branch
git reflog refs/heads/main

# Show with relative dates
git reflog --relative-date

# Show N entries
git reflog -10
```

Example reflog output:
```
m1n2o3p HEAD@{0}: rebase (finish): returning to refs/heads/feature/login
a3f2c91 HEAD@{1}: rebase (pick): feat: add login form validation
e4f5g6h HEAD@{2}: rebase (pick): feat: add login route
i7j8k9l HEAD@{3}: rebase (start): checkout main
q5r6s7t HEAD@{4}: commit: feat: add login form validation
b8c9d0e HEAD@{5}: commit: feat: add login route
p4q5r6s HEAD@{6}: checkout: moving from main to feature/login
```

### Recovery with reflog

```bash
# Scenario: You ran git reset --hard and lost important commits
git reflog
# Find the commit hash from before the reset (e.g., HEAD@{4})

# Option 1: Create a branch from the lost commit
git branch recovered-work HEAD@{4}
git checkout recovered-work

# Option 2: Reset back to the lost state
git reset --hard HEAD@{4}

# Option 3: Cherry-pick the lost commits onto current branch
git cherry-pick HEAD@{4}
```

> **Reflog has a 30-90 day window.** Git periodically garbage collects orphaned commits. By default, reflog entries expire after 90 days (30 days for unreachable objects). After that, they're truly gone.

---

## git bisect

**What it does**: Performs a binary search through your commit history to find the exact commit that introduced a bug.

**Why it's brilliant**: If a bug appeared somewhere in the last 200 commits, checking each one would take forever. Binary search finds it in `log2(200) ≈ 8` steps.

```bash
# Start the bisect session
git bisect start

# Mark the current commit as bad (has the bug)
git bisect bad

# Mark a known good commit (before the bug existed)
git bisect good v2.1.0
git bisect good a3f2c91

# Git checks out a commit halfway between good and bad
# You test the code, then tell Git:
git bisect bad     # This commit has the bug
# OR
git bisect good    # This commit is fine

# Git narrows down further. Repeat until:
# "b4d5f6a is the first bad commit"

# See what changed in the bad commit
git show b4d5f6a

# End the bisect session and return to original branch
git bisect reset

# View the bisect log
git bisect log
```

### Automated bisect with a test script

If you have a test that fails when the bug is present:

```bash
git bisect start
git bisect bad HEAD
git bisect good v2.1.0

# Run test automatically on each commit
# Script must exit 0 for good, 1 (or non-0) for bad
git bisect run npm test
git bisect run ./scripts/check-bug.sh

# Git automatically finds the bad commit
```

> **Real scenario**: Your monitoring alerts you at 2am — the payment success rate dropped from 98% to 60%. You check, and it was fine last week. There are 150 commits since then. `git bisect good v3.1` + `git bisect bad HEAD` + `git bisect run npm run test:payments` — Git finds the culprit commit in 8 automated steps while you drink coffee.

---

## git tag — Advanced Usage

```bash
# List all tags
git tag
git tag -l "v1.*"     # Wildcard filter

# Create lightweight tag
git tag v1.0.0

# Create annotated tag (has author, date, message — best for releases)
git tag -a v1.0.0 -m "First stable release — payment system complete"

# Tag a specific past commit
git tag -a v1.0.0 a3f2c91 -m "Retroactively tagging release"

# Show tag details
git show v1.0.0

# Push single tag to remote
git push origin v1.0.0

# Push all local tags
git push origin --tags

# Delete a local tag
git tag -d v1.0.0-beta

# Delete a remote tag
git push origin --delete v1.0.0-beta
git push origin :refs/tags/v1.0.0-beta   # Alternative

# Check out a tag (enters detached HEAD — read-only historical view)
git checkout v1.0.0

# Create a branch from a tag (for working on an old release)
git checkout -b hotfix/v1.0.1 v1.0.0
```

---

## Signed Commits (GPG/SSH)

Professional and security-conscious teams require cryptographically signed commits. This proves the commit was made by the person whose name is on it — not someone who got access to their account.

GitHub shows verified commits with a green "Verified" badge. Companies like Stripe, Cloudflare, and most financial services companies require this.

### GPG Signing

```bash
# Install GPG (if not already installed)
brew install gnupg        # macOS
sudo apt install gnupg    # Linux

# Generate a new GPG key
gpg --full-generate-key
# Choose: RSA and RSA, 4096 bits, doesn't expire (or set expiry)
# Enter your real name and the email matching your GitHub account

# List your keys to get the key ID
gpg --list-secret-keys --keyid-format=long
# sec   rsa4096/YOUR_KEY_ID 2024-01-01 [SC]

# Export the public key to add to GitHub
gpg --armor --export YOUR_KEY_ID
# Copy the entire output including -----BEGIN PGP PUBLIC KEY BLOCK-----

# Configure git to use this key
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true    # Auto-sign all commits
git config --global tag.gpgsign true       # Auto-sign all tags

# Manual signing
git commit -S -m "feat: signed commit"
git tag -s v1.0.0 -m "Signed release"

# Verify a signed commit
git verify-commit HEAD
git log --show-signature -1
```

### SSH Signing (Simpler, Recommended for New Setups)

Git 2.34+ supports using your SSH key for signing — the same key you use for authentication.

```bash
# Configure git to use SSH for signing
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub

# Optionally auto-sign
git config --global commit.gpgsign true

# Sign a commit
git commit -S -m "feat: signed commit"
```

Add your key to GitHub: **Settings → SSH and GPG Keys → New SSH signing key** (separate from authentication keys).

---

## Commit Timestamp Correction

Git stores two timestamps per commit: **author date** (when the code was written) and **committer date** (when the commit was made). Sometimes these need to be corrected:

- You worked offline and committed later
- Timezone was misconfigured
- You're rebasing old commits onto a new branch

```bash
# Set the author date when committing
git commit --date="2024-03-15T14:30:00+05:30" -m "feat: add login"

# Set both author and committer dates (via env variables)
GIT_AUTHOR_DATE="2024-03-15T14:30:00" \
GIT_COMMITTER_DATE="2024-03-15T14:30:00" \
git commit -m "feat: add login"

# Fix the date of the last commit (via amend)
git commit --amend --date="2024-03-15T14:30:00" --no-edit

# Preserve original timestamps during rebase
git rebase --committer-date-is-author-date main
```

> **Important**: In professional and regulated environments (finance, healthcare, legal), commit timestamps are audit trails. Altering them arbitrarily can violate compliance requirements. Use this only to correct genuine errors like timezone misconfiguration.

---

## Advanced git log — Searching History

```bash
# Find when a function was introduced or deleted
git log -S "function processPayment" --source --all

# Find all commits that touched a specific function
git log -L :processPayment:src/payments.js

# Find commits by a specific author in a date range
git log --author="Alice" --since="2024-01-01" --until="2024-06-01" --oneline

# Show all commits that haven't been merged into main
git log main..HEAD

# Show commits that are in main but not in your branch
git log HEAD..main

# Show commits that are in either branch but not both (symmetric difference)
git log main...feature/login

# Find the common ancestor of two branches
git merge-base main feature/login
```

---

## git blame

**What it does**: Shows who last modified each line of a file, and in which commit.

```bash
# Show blame for a file
git blame src/auth.js

# Show blame for specific line range
git blame -L 10,30 src/auth.js

# Show blame ignoring whitespace changes
git blame -w src/auth.js

# Show blame with email instead of name
git blame -e src/auth.js

# Show the commit that most recently changed the function
git blame -L :processPayment:src/payments.js

# Ignore specific commits in blame (e.g., formatting commits)
# Create .git-blame-ignore-revs file with commit hashes
echo "a3f2c91d..." >> .git-blame-ignore-revs
git blame --ignore-revs-file=.git-blame-ignore-revs src/auth.js

# Configure to always use ignore file
git config --global blame.ignoreRevsFile .git-blame-ignore-revs
```

> **Real scenario**: A bug is on line 47 of `src/payments.js`. `git blame src/payments.js` immediately tells you it was last modified by Bob in commit `e4f5g6h`. `git show e4f5g6h` shows you exactly what changed. Root cause found in 30 seconds.

---

## git submodules

Submodules let you include another Git repository inside your repository. Used when your project depends on another repo's specific version.

```bash
# Add a submodule
git submodule add https://github.com/org/library.git libs/library

# Clone a repo that has submodules (initialize and fetch them)
git clone --recurse-submodules https://github.com/you/repo.git
# OR for an already-cloned repo:
git submodule update --init --recursive

# Update all submodules to their latest remote commits
git submodule update --remote

# See the status of all submodules
git submodule status
```

> **Note**: Submodules are notoriously tricky to work with. Many teams prefer package managers (npm, pip, cargo) or monorepos over submodules. Only use them when you genuinely need to pin a specific version of another git repo.

---

## git filter-repo — Rewriting History

For when you need to remove a file from the entire history (leaked secrets, large binary files, legal reasons). This is a destructive, irreversible operation.

```bash
# Install (separate tool, not built into git)
pip install git-filter-repo

# Remove a file from ALL history
git filter-repo --path secrets.env --invert-paths

# Remove a directory from ALL history
git filter-repo --path build/ --invert-paths

# Remove all files matching a pattern
git filter-repo --path-glob "*.exe" --invert-paths

# Change author email across all history
git filter-repo --email-callback '
    return email if email != b"old@example.com" else b"new@example.com"
'
```

> **After filter-repo**: Force push to remote (`git push --force`), notify all collaborators to re-clone (their local repos are now diverged), and rotate any leaked secrets immediately.

---

# 9. Undoing Things — The Complete Taxonomy

This is the section most developers get wrong. There are four main commands for undoing things, and they do very different things. Choose the wrong one and you either lose work or break your team's history.

## Decision Framework

Ask yourself these questions in order:

**Question 1: Have these commits been pushed to a shared branch?**
- YES → Use `git revert` (safe for shared history)
- NO → You can use `reset`, `amend`, or `rebase -i`

**Question 2: How far back do you want to go?**
- Last commit → `git commit --amend` or `git reset HEAD~1`
- Multiple commits → `git reset HEAD~N` or `git rebase -i`
- A specific old commit → `git revert <hash>` or `git rebase -i`

**Question 3: Do you want to keep the changes as files?**
- Keep changes staged → `git reset --soft`
- Keep changes unstaged → `git reset --mixed` (default)
- Discard changes entirely → `git reset --hard` (careful!)

---

## git revert — The Safe Undo

**What it does**: Creates a *new commit* that is the inverse of the target commit. The original commit stays in history. The new revert commit cancels out its effect.

**When to use**: Any commit that has been pushed to a shared/public branch. This is the only safe way to "undo" on shared history.

```bash
# Revert the most recent commit
git revert HEAD

# Revert a specific commit
git revert a3f2c91

# Revert multiple commits (one revert commit per target)
git revert a3f2c91 e4f5g6h

# Revert a range of commits
git revert HEAD~3..HEAD    # Reverts the last 3 commits

# Stage the revert but don't commit (review first)
git revert --no-commit a3f2c91
git revert -n a3f2c91

# Revert a merge commit (need to specify which parent to keep)
git revert -m 1 a3f2c91    # Keep parent 1 (main branch)
git revert -m 2 a3f2c91    # Keep parent 2 (feature branch)
```

**What the history looks like after revert**:
```
A ── B ── C ── D ── E ── Revert-D  ← main
```
D still exists in history. The revert commit E cancels it out. Teammates can pull normally — no force push needed.

---

## git reset — Rewrite Local History

**What it does**: Moves the current branch pointer to a different commit. Depending on the mode, it also affects the staging area and working directory.

**When to use**: On LOCAL commits you haven't pushed yet, or on your own private feature branch.

### The Three Modes

```bash
# ── SOFT ────────────────────────────────────────────────────────
git reset --soft HEAD~1

# Effect:
# Branch pointer: moved back 1 commit ✅
# Staging area (index): changes come back staged ✅
# Working directory: untouched ✅

# The undone commit's changes are now staged, ready to recommit
# Use when: "I want to recommit with a better message"
#           "I want to combine this with my next commit"
```

```bash
# ── MIXED (default) ─────────────────────────────────────────────
git reset HEAD~1
git reset --mixed HEAD~1  # Same thing

# Effect:
# Branch pointer: moved back 1 commit ✅
# Staging area (index): cleared (changes unstaged) ✅
# Working directory: untouched ✅

# The undone commit's changes are in your working directory, unstaged
# Use when: "I committed too early — I want to re-stage things carefully"
#           "I want to split this commit into multiple commits"
```

```bash
# ── HARD ────────────────────────────────────────────────────────
git reset --hard HEAD~1

# Effect:
# Branch pointer: moved back 1 commit ✅
# Staging area (index): cleared ✅
# Working directory: all changes DISCARDED ✅ (⚠️ destructive)

# Everything is gone — files reverted to the state of the target commit
# Use when: "I made a mess, throw everything away, start from this commit"
# Recovery: possible via git reflog within 30-90 days
```

### Reset to specific commits

```bash
# Reset to a specific commit hash
git reset --soft a3f2c91
git reset a3f2c91
git reset --hard a3f2c91

# Reset to match the remote (throw away all local commits)
git reset --hard origin/main

# Reset a single file (unstage it)
git reset HEAD src/auth.js    # Older syntax
git restore --staged src/auth.js  # Modern syntax

# Reset a single file to a specific commit's version
git reset a3f2c91 src/auth.js
git restore --source=a3f2c91 src/auth.js
```

---

## git restore — Discard Working Directory Changes

`git restore` was introduced in Git 2.23 to handle the "discard file changes" use case that was previously handled by `git checkout`. It's clearer in intent.

```bash
# Discard unstaged changes in a file (restore to last committed state)
git restore src/auth.js

# Discard ALL unstaged changes in working directory
git restore .

# Unstage a file (move from staging area back to working directory)
git restore --staged src/auth.js

# Unstage all staged files
git restore --staged .

# Restore a file from a specific commit
git restore --source=HEAD~2 src/auth.js
git restore --source=a3f2c91 src/auth.js

# Restore a deleted file
git restore src/deleted-file.js    # Restores from last commit
```

> **⚠️ Warning**: `git restore src/file.js` (without `--staged`) permanently discards your working directory changes. There is NO undo for this. The file reverts to the last committed state. Only use when you're sure you want to throw those changes away.

---

## git commit --amend — Edit the Last Commit

**What it does**: Replaces the most recent commit with a new one. You can change the message, add forgotten files, or remove accidentally staged files.

**When to use**: Immediately after committing, BEFORE pushing.

```bash
# Change just the commit message
git commit --amend

# Change message inline
git commit --amend -m "feat: add OAuth login with Google (fixed typo)"

# Add a forgotten file to the last commit
git add forgotten-file.js
git commit --amend --no-edit    # --no-edit keeps the original message

# Remove a file from the last commit
git restore --staged accidentally-staged.env
git commit --amend --no-edit

# Change author of last commit
git commit --amend --author="New Name <newemail@example.com>"
```

> **⚠️ Never amend commits that have been pushed to a shared branch.** Amend creates a new commit with a different hash — if others have pulled the original, you'll cause diverged history. If you must fix a pushed commit, use `git revert` instead.

---

## Full Undo Comparison Table

| Scenario | Command | Staged? | Working Dir? | Safe for shared? |
|---|---|---|---|---|
| Discard unstaged file changes | `git restore <file>` | Unchanged | Reverted | N/A (local) |
| Unstage a file | `git restore --staged <file>` | Unstaged | Unchanged | N/A (local) |
| Fix last commit message | `git commit --amend` | Unchanged | Unchanged | ❌ No |
| Add file to last commit | `git add f && git commit --amend --no-edit` | Committed | Unchanged | ❌ No |
| Undo last commit, keep staged | `git reset --soft HEAD~1` | Changes staged | Unchanged | ❌ No |
| Undo last commit, unstage | `git reset HEAD~1` | Changes unstaged | Unchanged | ❌ No |
| Undo last commit, discard | `git reset --hard HEAD~1` | Cleared | Reverted | ❌ No |
| Undo a pushed commit safely | `git revert <hash>` | New revert commit | New revert files | ✅ Yes |
| Recover "lost" commits | `git reflog` then `git checkout` | — | — | ✅ Yes |
| Remove from all history | `git filter-repo` | History rewritten | Reverted | ❌ Force push needed |

---

# 10. GitHub-Specific Features

## Pull Requests (PRs)

A Pull Request is GitHub's mechanism for:
1. Proposing that changes from one branch be merged into another
2. Facilitating code review before the merge happens
3. Running automated checks (CI/CD) before merge
4. Creating an audit trail of why and how each change was made

### The Anatomy of a Good PR

**Title**: Follow conventional commits format.
```
feat: add Stripe payment integration for subscription plans
fix: resolve race condition in session token refresh
```

**Description** (use a template — most teams have one):
```markdown
## What
Added Stripe subscription payment processing including:
- Customer creation on signup
- Subscription plan selection
- Webhook handling for payment events

## Why
Closes #142 — We need paid tiers to hit Q3 revenue targets.

## How to Test
1. Use Stripe test mode (already configured in .env.example)
2. Use card 4242 4242 4242 4242 (Stripe test success card)
3. Go to /pricing, select a plan, complete checkout
4. Verify subscription appears in /dashboard/billing

## Screenshots
[screenshot of the pricing page]
[screenshot of checkout flow]

## Notes
- Stripe webhook endpoint is /api/webhooks/stripe — needs to be configured in Stripe Dashboard
- Test mode vs live mode toggled by STRIPE_SECRET_KEY in env
```

### PR Best Practices

**As the author**:
- Keep PRs under 400 lines of diff when possible (large PRs get rubber-stamped)
- Open a Draft PR early to share WIP and get early feedback
- Reference the issue: `Closes #142` (GitHub will auto-close the issue on merge)
- Request specific reviewers, not everyone on the team
- Resolve all review comments (or explain why you're not addressing them)
- Don't merge your own PRs (unless you're solo or the team explicitly allows it)

**As a reviewer**:
- Review within 24 hours (don't leave teammates blocked)
- Use a "nit:" prefix for non-blocking suggestions: `nit: could rename this to be more descriptive`
- Distinguish blocking from non-blocking: "This will cause a bug" vs "This is just stylistic"
- Be specific: "Line 47: this could throw if user is null" not "there might be bugs"
- Approve when it's good enough — perfect is the enemy of shipped

### Merge Strategies on GitHub

GitHub offers three merge options:
1. **Create a merge commit**: Standard three-way merge, preserves full branch history
2. **Squash and merge**: All PR commits squashed into one. Cleanest main history.
3. **Rebase and merge**: Replay commits linearly on main without a merge commit

Most startups use **Squash and merge** — it keeps main's history one-commit-per-feature, very readable.

---

## Issues

GitHub Issues are your bug tracker, feature request board, and task management — all in one.

```markdown
# Good issue template

**Bug Report: Login fails with special characters in password**

## Describe the bug
Users with passwords containing special characters (#, @, %) cannot log in.
The login form accepts the password but the API returns 401.

## Steps to Reproduce
1. Register with password: `test@#$%pass`
2. Log out
3. Attempt to log in
4. See 401 Unauthorized

## Expected behavior
User logs in successfully

## Environment
- OS: macOS 14.2
- Browser: Chrome 122
- Version: v2.4.1

## Possible cause
The password may not be URL-encoded before being sent to the API.
See `src/auth/loginHandler.js:47`
```

---

## GitHub Actions — CI/CD

GitHub Actions lets you automate workflows triggered by Git events. Every push, PR, tag, or schedule can trigger a workflow.

### Basic CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]  # Test on multiple versions
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Requires approval in GitHub UI
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to AWS
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          npm ci
          npm run build
          aws s3 sync dist/ s3://your-bucket
```

### Common Action Patterns

```yaml
# Auto-assign reviewers
- uses: auto-assign-action@v1.2.4
  with:
    configuration-path: .github/auto_assign.yml

# Auto-label PRs based on files changed
- uses: actions/labeler@v4

# Comment on PR with preview deployment URL
- uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: '🚀 Preview: https://preview-' + context.sha + '.example.com'
      })
```

---

## GitHub Codespaces

Codespaces provides a full VS Code development environment in the browser (or in your local VS Code via remote connection), pre-configured for your repository.

### Why It Matters for Teams

The "works on my machine" problem is solved. Every developer gets an identical environment. New team members are productive on day one instead of day three.

```json
// .devcontainer/devcontainer.json
{
  "name": "Startup App",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:18",
  
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },
  
  "forwardPorts": [3000, 5432],
  
  "postCreateCommand": "npm ci && cp .env.example .env",
  
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-azuretools.vscode-docker"
      ],
      "settings": {
        "editor.formatOnSave": true
      }
    }
  },
  
  "secrets": {
    "DATABASE_URL": {},
    "STRIPE_SECRET_KEY": {}
  }
}
```

With this file in your repo, clicking "Code → Codespaces → Create codespace" gives any team member a fully configured, ready-to-run development environment in under 2 minutes.

---

## Branch Protection Rules

Set at: **GitHub → Repository → Settings → Branches → Add branch protection rule**

For `main` on any team project:

```
Branch name pattern: main

✅ Require a pull request before merging
   Required approvals: 1 (small team) or 2 (larger team)
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ✅ Require review from Code Owners

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Status checks: ci/test, ci/build, ci/lint

✅ Require conversation resolution before merging

✅ Require signed commits (for high-security environments)

✅ Do not allow bypassing the above settings
   (Check this so even admins must follow the rules)

✅ Restrict who can push to matching branches
   Only specified people or teams

✅ Restrict force pushes
```

---

## GitHub CLI (gh)

The 4 commands that save the most time:

```bash
# Install
brew install gh   # macOS
# Then authenticate:
gh auth login

# Create a PR from current branch
gh pr create
gh pr create --title "feat: add auth" --body "Closes #42" --reviewer alice,bob

# View and merge a PR
gh pr list
gh pr merge 123 --squash

# Checkout a PR locally (for review or testing)
gh pr checkout 123

# View CI status
gh pr checks 123

# Clone a repo
gh repo clone org/repo

# Create a new repo
gh repo create my-project --public --source=.

# Create an issue
gh issue create --title "Bug: login fails" --body "Steps to reproduce..."

# View workflow runs
gh run list
gh run view 123456
gh run watch    # Watch current run live

# Open anything in browser
gh repo view --web
gh pr view 123 --web
```

---

# 11. Real-World Workflows

## Solo Developer Workflow

```bash
# Morning routine
git pull                                    # Sync with remote
git log --oneline -5                        # See what's there

# Start a feature
git checkout -b feature/search-ui           # Always branch, even solo

# Work
# ... write code ...
git add -p                                  # Stage thoughtfully
git commit -m "feat: add search input component"

# ... more code ...
git add .
git commit -m "feat: connect search to API"

# Push (and back up your work)
git push -u origin feature/search-ui

# Feature done — merge to main
git checkout main
git merge feature/search-ui                 # Or open a PR even solo
git push
git branch -d feature/search-ui            # Clean up
```

---

## Feature Branch Workflow (5-20 person startup)

This is the most common workflow at early and growth-stage startups.

```bash
# Start of every task:
git checkout main
git pull                                    # ALWAYS pull first

# Create feature branch
git checkout -b feature/stripe-integration

# Work in small commits
git add -p
git commit -m "feat: add Stripe SDK initialization"

git add src/payments/
git commit -m "feat: implement charge endpoint"

git add src/webhooks/
git commit -m "feat: handle Stripe webhook events"

# Before opening PR — sync with main
git fetch origin
git rebase origin/main                      # Replay your commits on latest main

# If rebase conflicts:
# Fix each conflict, then:
git add <resolved-files>
git rebase --continue

# Clean up commits if needed (optional but professional)
git rebase -i HEAD~3                        # Squash WIP commits

# Push (with force-with-lease because we rebased)
git push -u origin feature/stripe-integration
# OR if already pushed before:
git push --force-with-lease

# Open PR on GitHub
gh pr create --title "feat: add Stripe payment integration" \
             --body "Closes #89\n\nAdds subscription payments via Stripe." \
             --reviewer @alice @bob

# After PR approval and CI passes — merge (usually squash merge)
# After merge — cleanup
git checkout main
git pull
git branch -d feature/stripe-integration
```

---

## Git Flow — For Apps With Versioned Releases

Git Flow has five branch types:
- **main**: Production-ready code. Only ever receives merges from release and hotfix branches.
- **develop**: Integration branch. All features merge here first.
- **feature/***: One per feature, branched from develop, merged back to develop.
- **release/***: Branched from develop when ready to release. Only bug fixes here. Merged to both main and develop.
- **hotfix/***: Branched from main (production) for emergency fixes. Merged to both main and develop.

```bash
# Install git-flow extension (optional but helpful)
brew install git-flow-avh

# Initialize git-flow in repo
git flow init

# Start a feature
git flow feature start user-authentication
# Equivalent to: git checkout -b feature/user-authentication develop

# Finish a feature (merges to develop, deletes branch)
git flow feature finish user-authentication

# Start a release
git flow release start 2.1.0
# Equivalent to: git checkout -b release/2.1.0 develop

# Finish a release (merges to main AND develop, tags main)
git flow release finish 2.1.0

# Start a hotfix
git flow hotfix start fix-payment-bug
git flow hotfix finish fix-payment-bug
```

**Verdict**: Git Flow is good for mobile apps (you can't force-update users), libraries with multiple supported versions, and enterprise software with scheduled release trains. For SaaS web apps where you deploy continuously, **trunk-based development has largely won**.

---

## Trunk-Based Development

Everyone commits to `main` (the "trunk") frequently. Feature branches are short-lived (hours to 1-2 days). Incomplete features are hidden behind feature flags, not on long-lived branches.

```bash
# Short-lived feature branch
git checkout -b add-search-debounce main
# ... 2-3 hours of focused work ...
git add -A && git commit -m "feat: debounce search input (100ms)"
git push -u origin add-search-debounce
# PR opened, reviewed, merged same day

# Feature flags for incomplete work
if (featureFlags.isEnabled('new-payment-ui', user)) {
  return <NewPaymentUI />;
}
return <LegacyPaymentUI />;
```

Benefits:
- No merge conflicts from long-lived branches
- Always shippable (deploy from main anytime)
- Forces small, focused commits
- Continuous integration is natural

Requirements:
- Good test coverage (you need confidence to merge frequently)
- Feature flag system
- Fast CI pipeline (under 5 minutes)

---

## Open Source Contribution Workflow

```bash
# 1. Fork the repo on GitHub UI
# 2. Clone YOUR fork
git clone git@github.com:YOUR-USERNAME/react.git
cd react

# 3. Add the original repo as 'upstream'
git remote add upstream git@github.com:facebook/react.git
git remote -v
# origin   git@github.com:YOUR-USERNAME/react.git
# upstream git@github.com:facebook/react.git

# 4. Keep your fork synced
git fetch upstream
git checkout main
git rebase upstream/main
git push origin main

# 5. Create a feature branch
git checkout -b fix/stale-closure-in-useEffect

# 6. Make changes, commit, push to YOUR fork
git add .
git commit -m "fix: resolve stale closure in useEffect cleanup"
git push origin fix/stale-closure-in-useEffect

# 7. Open a PR from your fork's branch to the original repo
# GitHub shows a banner: "Compare & Pull Request"
```

**Tips for successful open source PRs**:
- Read the `CONTRIBUTING.md` file (always exists in serious projects)
- Check if there's already an issue or PR for your change
- Start with small contributions (docs, tests) to learn the codebase
- Follow the project's existing code style religiously
- One feature/fix per PR — never bundle unrelated changes
- Be patient — maintainers are volunteers and often busy

---

## Monorepo vs Polyrepo

### Monorepo Structure
```
company-repo/
├── packages/
│   ├── api/           ← Node.js backend
│   ├── web/           ← React frontend
│   ├── mobile/        ← React Native app
│   └── shared/        ← Shared types, utilities
├── services/
│   ├── payments/
│   └── notifications/
├── tools/
├── package.json       ← Root workspace config
└── turbo.json         ← Build orchestration (Turborepo)
```

**Monorepo pros**:
- Atomic cross-project changes in one PR (change API type + update frontend in same commit)
- Shared tooling (one linter config, one test setup)
- Easy to refactor across the entire codebase
- Single source of truth for all code
- Easier onboarding ("clone one repo, you have everything")

**Monorepo cons**:
- Repo grows very large over time
- CI needs to be smart about only building/testing changed packages (Turborepo, Nx, Bazel)
- Git operations can get slow (git log, git blame on large repos)
- Requires tooling investment

**Who uses monorepos**: Google (entire codebase), Meta, Airbnb, Stripe, many modern startups.

**Polyrepo pros**:
- Each service is independent — its own deployment, its own CI, its own release cycle
- Teams have full ownership of their service
- Easier to give contractors/external teams access to one service

**Polyrepo cons**:
- Cross-service changes require coordinated PRs across multiple repos
- Sharing code requires publishing to package registry
- "Dependency hell" — which version of the shared library is service A using?

**Verdict**: Most startups benefit from a monorepo until they're large enough that team ownership boundaries require hard separation. Start with a monorepo; split into polyrepo when organizational scale demands it.

---

# 12. Tips, Best Practices & Gotchas

## The Golden Rules

### 1. Pull Before You Push (and Before You Start)
```bash
# Wrong (risk of conflicts, diverged history)
git checkout main
# ... start coding immediately ...

# Right
git checkout main
git pull                    # Always sync first
git checkout -b feature/x  # Then branch
```

### 2. Commit Small and Often
Don't wait until the end of the day. Commit whenever you reach a logical checkpoint:
- "Got the login route working" → commit
- "Added form validation" → commit
- "Connected to the database" → commit

Small commits = easier to understand, easier to revert, easier to cherry-pick.

### 3. Write Commits for Humans, Not Computers
```bash
# Bad
git commit -m "fix"
git commit -m "update stuff"
git commit -m "wip"
git commit -m "asdf"

# Good
git commit -m "fix: handle null user object in session middleware"
git commit -m "feat: add pagination to /api/users endpoint"
git commit -m "refactor: extract auth logic into separate middleware"
```

The rule: if someone reads this commit message in 6 months with no other context, do they understand what changed and why?

### 4. Never Commit Secrets
```bash
# If you do accidentally commit a secret:
# 1. Rotate the secret IMMEDIATELY — it's compromised
# 2. Remove it from history:
git filter-repo --path .env --invert-paths
# 3. Force push
git push --force
# 4. Tell all collaborators to re-clone
```

### 5. Review Before Committing
```bash
# Always review what you're about to commit:
git diff --staged    # See exactly what's staged
git status           # Check nothing unexpected is included
```

### 6. Use .gitignore Properly
```bash
# If something is already tracked and you add it to .gitignore:
# .gitignore only affects untracked files. You must stop tracking it:
git rm --cached .env
git commit -m "chore: stop tracking .env file"
```

---

## Common Gotchas and How to Avoid Them

### Gotcha 1: Committed to the Wrong Branch

```bash
# You committed to main instead of your feature branch
# Solution: Move the commit to the right branch

# Step 1: Note the commit hash
git log --oneline -3
# a3f2c91 feat: my feature (this one is wrong)

# Step 2: Create correct branch from this commit
git checkout -b feature/correct-branch

# Step 3: Go back to main and remove the commit
git checkout main
git reset --hard HEAD~1    # Remove last commit from main

# Your commit is now only on feature/correct-branch
```

### Gotcha 2: Accidentally Deleted a Branch

```bash
# Find the commit that was the tip of the deleted branch
git reflog | grep "branch-name"
# OR: look for recent commits
git reflog

# Recreate the branch
git checkout -b recovered-branch HEAD@{5}
# OR
git branch recovered-branch a3f2c91
```

### Gotcha 3: Forgot to Pull Before Pushing

```bash
git push
# ! [rejected] main -> main (fetch first)
# error: failed to push some refs

# Solution:
git pull --rebase   # Fetch remote changes and replay your commits on top
git push            # Now it works
```

### Gotcha 4: Pushed Sensitive Data

```bash
# 1. Remove from history
git filter-repo --path secrets.json --invert-paths

# 2. Force push
git push --force

# 3. Rotate the secret (CRITICAL — anyone may have already seen it)
# GitHub may have already cached the content even after force push

# 4. If it was a token/API key — revoke it on the provider immediately
```

### Gotcha 5: Merge Conflict in a Binary File

```bash
# Git can't auto-merge binary files (images, PDFs, etc.)
# You must choose one version:
git checkout --ours path/to/image.png    # Keep your version
git checkout --theirs path/to/image.png  # Keep incoming version
git add path/to/image.png
```

### Gotcha 6: `.gitignore` Not Working

```bash
# .gitignore only ignores untracked files
# If the file is already tracked, you need to untrack it:
git rm --cached filename
git rm --cached -r directory/
git commit -m "chore: remove tracked files that should be ignored"
# Now .gitignore will work for those files
```

### Gotcha 7: Rebase Conflicts Repeat

```bash
# Using git rerere (Reuse Recorded Resolution)
git config --global rerere.enabled true

# Now Git remembers how you resolved a conflict
# If the same conflict appears again (during repeated rebases), it auto-resolves
```

---

## Workflow Tips for Teams

### Sync Branches Regularly
```bash
# The longer you wait to sync with main, the bigger the eventual conflict
# Rebase onto main daily when working on a long feature:
git fetch origin
git rebase origin/main

# Or set up automatic pull.rebase:
git config --global pull.rebase true
```

### Keep PRs Focused
One PR = one concern. Not "feature + refactor + dependency update + bug fix."
This makes reviewing easier, reverting easier, and git bisect accurate.

### Communicate Before Big Refactors
"I'm refactoring `auth.js` and moving functions around today" — a Slack message that saves your team 2 hours of conflict resolution.

### Clean Up Merged Branches
```bash
# Delete branches after merge (locally)
git branch -d feature/login

# Delete on remote
git push origin --delete feature/login

# Clean up remote-tracking branches that no longer exist
git fetch --prune
git remote prune origin

# Clean up all merged local branches at once:
git branch --merged main | grep -v "main\|master\|develop" | xargs git branch -d
```

### Review PRs Promptly
Leaving a PR unreviewed for 3 days forces the author to keep rebasing. Set a team norm: PRs get reviewed within 24 hours, ideally same day.

---

## Commit Message Template

Set a global commit message template:

```bash
git config --global commit.template ~/.gitmessage.txt
```

`~/.gitmessage.txt`:
```
# <type>(<scope>): <subject> (50 chars max)
# |<---- Try To Limit Each Line to a Maximum Of 72 Characters ---->|

# Body: explain the WHAT and WHY (not HOW — the code shows how)

# Footer: reference issues, breaking changes
# Closes #

# Types: feat|fix|docs|style|refactor|perf|test|chore|ci|revert
# Scope: (optional) the part of the codebase affected
```

---
# 13. Your First Startup PR — Full Walkthrough

This is the capstone. Everything in this guide comes together here. You've just joined Velocity — a 12-person Series A startup building B2B SaaS. It's Monday morning. Here's every command you'd run from Day 1 to your first merged PR, with exactly why you're running each one.

---

## The Setup: Day 1

**Slack message from your tech lead:**

> "Hey! Welcome to the team 🎉 Repo is at github.com/velocity-hq/api. I've sent you a GitHub invite. Jira ticket for your first task is PROJ-89 — add the forgot password flow. Main branch is protected, we squash merge all PRs, CI must pass before merge. Ask me anything. Lmk when you have the PR up."

---

### Step 1: Configure Git (if not already done)

Before you even clone, make sure Git knows who you are with your *work* email.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@velocity.com"    # Must match your GitHub account
git config --global init.defaultBranch main
git config --global pull.rebase true                  # Rebasing as default pull strategy

# Set up your SSH key if you haven't
ssh-keygen -t ed25519 -C "you@velocity.com"
cat ~/.ssh/id_ed25519.pub   # Copy and add to GitHub Settings → SSH Keys
ssh -T git@github.com       # Test the connection
```

---

### Step 2: Clone the Repository

```bash
git clone git@github.com:velocity-hq/api.git
cd api
```

**What happened**: Git cloned the entire repo — all commits, all branches — and set up `origin` pointing to GitHub. You're now on `main`.

```bash
# Explore what you just got
git log --oneline -10           # See recent commit history
git branch -a                  # See all local + remote branches
git log --oneline --graph --all # Visualize the branch structure
ls -la                          # See the file structure
cat README.md                   # Read the README (always)
```

---

### Step 3: Understand the Codebase First

Before writing a line of code, explore how the existing auth system works.

```bash
# Find existing auth-related code
git log --all -S "password" --oneline    # Commits that introduced "password"
git log -- src/auth/ --oneline           # History of the auth directory
git blame src/auth/login.js              # Who wrote what in login

# See how a similar feature (email verification) was implemented
git log --all --grep="email verification" --oneline
git show a3f2c91    # Look at that commit in detail
```

---

### Step 4: Create Your Feature Branch

It's Tuesday morning. You've read the code, you understand the system, you're ready to build.

```bash
# Always start from a fresh main
git checkout main
git pull                                    # CRITICAL: sync before branching

# Create the feature branch
# Convention at Velocity: type/PROJ-ID-short-description
git checkout -b feature/PROJ-89-forgot-password

# Confirm you're on the right branch
git status
# On branch feature/PROJ-89-forgot-password
# nothing to commit, working tree clean
```

---

### Step 5: Build the Feature (Commit as You Go)

You're not going to write all the code and then commit once. You're going to commit at each logical step.

**~2 hours later: You've written the forgot password API endpoint**

```bash
git status
# Modified: src/auth/routes.js
# New file: src/auth/forgotPassword.js
# New file: src/emails/passwordReset.html

# Stage thoughtfully — not just `git add .`
git add src/auth/routes.js src/auth/forgotPassword.js
git diff --staged                           # Review exactly what's staged
git commit -m "feat(auth): add forgot password API endpoint

Adds POST /auth/forgot-password that:
- Validates email exists in the database
- Generates a secure reset token (32 bytes, 1 hour TTL)
- Sends reset email via SendGrid
- Returns 200 even if email not found (security: don't leak user existence)

Part of PROJ-89"
```

**~1 hour later: Email template done**

```bash
git add src/emails/passwordReset.html
git commit -m "feat(auth): add password reset email template

HTML email with reset link. Includes:
- Velocity branding
- Clear CTA button
- 1 hour expiry warning
- Plain text fallback"
```

**~2 hours later: Reset token handler done**

```bash
git add src/auth/resetPassword.js
git add src/auth/routes.js            # You updated routes again
git commit -m "feat(auth): add password reset token validation endpoint

Adds POST /auth/reset-password that:
- Validates token format and existence
- Checks token hasn't expired
- Hashes and saves new password
- Invalidates the token (single use)"
```

**~1 hour later: Tests written**

```bash
git add tests/auth/forgotPassword.test.js
git add tests/auth/resetPassword.test.js
git commit -m "test(auth): add unit and integration tests for password reset flow

- 8 unit tests for token generation/validation
- 3 integration tests for the full flow
- Mocked SendGrid to avoid actual email sends in tests"
```

---

### Step 6: Sync with Main Before Opening PR

Two days have passed. Your teammates have been merging PRs. You need to incorporate their changes.

```bash
# Fetch what's on the remote
git fetch origin

# See what's new on main that you don't have
git log HEAD..origin/main --oneline
# e4f5g6h (origin/main) feat: add rate limiting middleware
# i7j8k9l chore: upgrade SendGrid SDK to v8

# Rebase your commits on top of the latest main
git rebase origin/main
```

**If a conflict occurs during rebase:**

```bash
# Git pauses and tells you:
# CONFLICT (content): Merge conflict in src/auth/routes.js
# error: could not apply a3f2c91... feat(auth): add forgot password API endpoint

git status
# both modified: src/auth/routes.js

# Open the file in VS Code and resolve
code src/auth/routes.js

# After resolving (removing all conflict markers):
git add src/auth/routes.js
git rebase --continue

# Git applies the next commit. If another conflict:
# ... repeat the process ...

# When all commits are replayed:
# Successfully rebased and updated refs/heads/feature/PROJ-89-forgot-password
```

---

### Step 7: Clean Up Commits Before PR

You have 4 commits. They're already clean and logical in this case, but let's say you also have a couple of WIP commits that snuck in.

```bash
git log --oneline
# m1n2o3p test(auth): add unit and integration tests
# q5r6s7t feat(auth): add password reset token validation endpoint
# a3f2c91 feat(auth): add password reset email template
# e4f5g6h feat(auth): add forgot password API endpoint
# b8c9d0e WIP: started this but not done
# p4q5r6s fix: remove debug console.log

# Interactive rebase to clean these up
git rebase -i HEAD~6

# In the editor:
# pick e4f5g6h feat(auth): add forgot password API endpoint
# pick a3f2c91 feat(auth): add password reset email template
# pick q5r6s7t feat(auth): add password reset token validation endpoint
# pick m1n2o3p test(auth): add unit and integration tests
# fixup p4q5r6s fix: remove debug console.log    ← squash into prev
# drop b8c9d0e WIP: started this but not done    ← drop entirely

# Save and close. Git replays the commits.
```

---

### Step 8: Run Tests Locally

Never open a PR with failing tests. Even if CI will catch it.

```bash
npm test
# PASS tests/auth/forgotPassword.test.js
# PASS tests/auth/resetPassword.test.js
# PASS tests/auth/login.test.js    (existing tests — didn't break them)
# Test Suites: 3 passed, 3 total
# Tests: 28 passed, 28 total

npm run lint
# ✔ No linting errors found
```

---

### Step 9: Push Your Branch

```bash
git push -u origin feature/PROJ-89-forgot-password
# Branch 'feature/PROJ-89-forgot-password' set up to track remote branch
# 'feature/PROJ-89-forgot-password' from 'origin'.
# To github.com:velocity-hq/api.git
#  * [new branch] feature/PROJ-89-forgot-password -> feature/PROJ-89-forgot-password

# GitHub will print a URL to create the PR:
# remote: Create a pull request for 'feature/PROJ-89-forgot-password' on GitHub by visiting:
# remote:   https://github.com/velocity-hq/api/pull/new/feature/PROJ-89-forgot-password
```

---

### Step 10: Open the Pull Request

Open the GitHub URL. Write a great PR description:

```markdown
## feat(auth): forgot password flow

**Closes PROJ-89** | **Closes #142**

### What
Implements the complete forgot password flow:
1. User enters their email on /forgot-password
2. If email exists, they receive a password reset email with a 1-hour link
3. Clicking the link takes them to /reset-password?token=xxx
4. They enter and confirm a new password
5. Token is invalidated after use (single-use)

### Security Notes
- POST /auth/forgot-password always returns 200, even if email doesn't exist (prevents user enumeration)
- Reset tokens: 32 random bytes, SHA-256 hashed before storage
- Token TTL: 1 hour
- Tokens are single-use and immediately invalidated on successful reset
- Rate limiting: existing middleware limits to 5 requests/hour per IP (already covers this endpoint)

### How to Test
1. Run `npm run dev`
2. POST to `localhost:3000/auth/forgot-password` with `{"email": "test@example.com"}`
3. Check SendGrid activity log (or the console in development mode — emails are logged, not sent)
4. Copy the token from the log
5. POST to `localhost:3000/auth/reset-password` with `{"token": "xxx", "password": "newpassword123"}`
6. Verify login works with new password

### Dependencies Changed
- No new dependencies added
- Uses existing SendGrid SDK (already in package.json)
- Uses existing token utilities in `src/utils/crypto.js`

### Screenshots
[Attached: password reset email screenshot in test mode]
```

**Request reviewers**: Tag your tech lead + one other backend engineer.

---

### Step 11: Respond to Review Comments

24 hours later, your tech lead leaves two comments:

**Comment 1** (on `forgotPassword.js:34`):
> "Consider using `crypto.randomBytes(32).toString('hex')` instead of the uuid library for the token — we don't need UUID format and this is slightly more secure for tokens."

**Your response**:
```bash
# Make the change
code src/auth/forgotPassword.js
# ... update the token generation ...

git add src/auth/forgotPassword.js
git commit -m "refactor: use crypto.randomBytes for reset token per review"
git push
```

Then reply on GitHub: "Good call, updated. Using `crypto.randomBytes(32).toString('hex')` now — 64 hex chars, 256 bits of entropy."

**Comment 2** (on the test file):
> "nit: could add a test for the expired token case"

**Your response**:
```bash
# Add the test
git add tests/auth/forgotPassword.test.js
git commit -m "test: add expired token rejection test case"
git push
```

Reply: "Added! Test verifies that a token past its TTL returns 401."

---

### Step 12: PR Approved — CI Passes — Merge

Your tech lead approves. CI shows all green. The "Merge pull request" button is green.

Since Velocity uses squash merges, all your commits get condensed into one commit on main. GitHub prompts for a final commit message — write a clean one:

```
feat(auth): add forgot password flow

Implements complete password reset via email:
- POST /auth/forgot-password: generates single-use token, sends email
- POST /auth/reset-password: validates token, updates password
- Security: user enumeration prevention, 1hr TTL, crypto.randomBytes tokens

Closes #142, PROJ-89
```

Click "Confirm squash and merge."

---

### Step 13: Cleanup

```bash
# Back to main
git checkout main

# Pull the merged commit
git pull
git log --oneline -3
# a8b9c0d feat(auth): add forgot password flow  ← your squashed commit!
# e4f5g6h feat: add rate limiting middleware
# i7j8k9l chore: upgrade SendGrid SDK to v8

# Delete your local feature branch (it's merged, no longer needed)
git branch -d feature/PROJ-89-forgot-password

# GitHub auto-deleted the remote branch (if configured), but if not:
git push origin --delete feature/PROJ-89-forgot-password
```

**You're done.** That's a complete, professional startup PR workflow. The CI deployed the squashed commit to staging automatically. QA will verify it there. Next sprint, it ships to production.

---

# 14. Quick Reference Cheatsheet

## Setup

```bash
git config --global user.name "Name"
git config --global user.email "email"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global alias.lg "log --oneline --graph --decorate --all"
```

## Starting Out

```bash
git init                        # New repo in current directory
git clone <url>                 # Clone a remote repo
git clone <url> --depth 1       # Shallow clone (faster)
```

## Daily Workflow

```bash
git status                      # What's going on?
git status -s                   # Short format
git add <file>                  # Stage a file
git add .                       # Stage everything
git add -p                      # Interactive staging
git commit -m "message"         # Commit staged files
git commit -am "message"        # Stage tracked + commit
git push                        # Push to remote
git pull                        # Fetch + rebase (if configured)
git fetch                       # Download without merging
git log --oneline               # Compact history
git log --oneline --graph --all # Visual branch graph
git diff                        # Unstaged changes
git diff --staged               # Staged changes
```

## Branches

```bash
git branch                      # List local branches
git branch -a                   # List all (including remote)
git branch feature/name         # Create branch (stay where you are)
git checkout -b feature/name    # Create + switch
git switch -c feature/name      # Create + switch (modern)
git checkout main               # Switch to main
git switch main                 # Switch to main (modern)
git branch -d feature/name      # Delete (safe — merged only)
git branch -D feature/name      # Force delete
git push -u origin feature/name # Push new branch to remote
git push origin --delete feature/name  # Delete remote branch
```

## Merging & Rebasing

```bash
git merge feature/name          # Merge branch into current
git merge --no-ff feature/name  # Force merge commit
git merge --squash feature/name # Squash into staged changes
git merge --abort               # Cancel an in-progress merge
git rebase main                 # Rebase onto main
git rebase -i HEAD~N            # Interactive rebase (last N commits)
git rebase --continue           # After resolving conflict
git rebase --abort              # Cancel an in-progress rebase
git cherry-pick a3f2c91         # Apply a specific commit
```

## Undoing Things

```bash
# SAFE (doesn't rewrite shared history)
git revert HEAD                 # Undo last commit (new revert commit)
git revert a3f2c91              # Undo specific commit

# UNSAFE (rewrites history — only on local/private branches)
git commit --amend              # Edit last commit
git commit --amend --no-edit    # Add to last commit (keep message)
git reset --soft HEAD~1         # Undo commit, keep staged
git reset HEAD~1                # Undo commit, unstage (keep files)
git reset --hard HEAD~1         # Undo commit, discard files
git reset --hard origin/main    # Reset to match remote

# File-level operations
git restore <file>              # Discard unstaged file changes
git restore --staged <file>     # Unstage a file
git restore --source=HEAD~2 <file>  # Restore file from old commit
```

## Advanced

```bash
git stash                       # Stash everything
git stash push -m "name"        # Named stash
git stash list                  # List stashes
git stash pop                   # Apply + remove latest stash
git stash apply stash@{2}       # Apply specific stash (keep it)
git stash drop stash@{0}        # Delete a stash

git reflog                      # Show HEAD history (recovery tool)
git branch recovery HEAD@{5}    # Recover from reflog

git bisect start                # Start binary search for bug
git bisect good v1.0            # Mark known good commit
git bisect bad                  # Mark bad commit
git bisect reset                # End bisect

git tag v1.0.0                  # Lightweight tag
git tag -a v1.0.0 -m "msg"      # Annotated tag
git push origin v1.0.0          # Push tag

git blame src/file.js           # See who changed each line
git log -S "function name"      # Find when code was added
git log -L :funcName:file.js    # History of a specific function
```

## Remote Operations

```bash
git remote -v                   # List remotes
git remote add upstream <url>   # Add a remote
git remote remove upstream      # Remove a remote
git fetch origin                # Fetch from remote
git fetch --all                 # Fetch from all remotes
git fetch --prune               # Fetch + remove stale branches
git push --force-with-lease     # Safe force push
git pull --rebase               # Pull with rebase
```

## Inspection

```bash
git show a3f2c91                # Show a commit (diff + message)
git show v1.0.0                 # Show a tag
git show a3f2c91:src/file.js    # Show file at specific commit
git diff main..feature          # Compare branches
git diff HEAD origin/main       # Local vs remote
cat .git/HEAD                   # See where HEAD points
git cat-file -p HEAD            # Inspect the HEAD commit object
```

## GitHub CLI

```bash
gh pr create                    # Create a PR
gh pr list                      # List open PRs
gh pr checkout 123              # Checkout a PR locally
gh pr merge 123 --squash        # Merge a PR
gh pr checks 123                # View CI status
gh issue create                 # Create an issue
gh run list                     # View workflow runs
gh repo clone org/repo          # Clone a repo
```

---

# Appendix A: Git Internals — Object Hashing

Understanding how Git's content-addressed storage works helps demystify everything.

```bash
# Every Git object is named by the SHA-1 hash of its content
# You can hash any content to see what its object name would be:
echo "hello world" | git hash-object --stdin
# b7e23ec29af22b0b4e41da31e868d57226121c84

# Actually store it as a Git object:
echo "hello world" | git hash-object --stdin -w

# Retrieve it:
git cat-file -p b7e23ec29af22b0b4e41da31e868d57226121c84
# hello world

# This is how git stores every file in your project
# Same content = same hash = stored only once (deduplication)
```

This content-addressed model is why Git is:
- **Fast**: Finding an object is an O(1) hash lookup
- **Efficient**: Identical files across branches stored once
- **Reliable**: The hash is both the name AND the integrity check — if data is corrupted, the hash won't match

---

# Appendix B: Useful Git Configs

```ini
# ~/.gitconfig — a well-configured setup

[user]
    name = Your Name
    email = you@example.com
    signingkey = ~/.ssh/id_ed25519.pub  # For SSH signing

[core]
    editor = code --wait
    autocrlf = input              # macOS/Linux
    excludesFile = ~/.gitignore   # Global gitignore

[init]
    defaultBranch = main

[pull]
    rebase = true                 # Always rebase on pull

[push]
    autoSetupRemote = true        # Auto -u on first push of new branches
    followTags = true             # Push tags along with commits

[fetch]
    prune = true                  # Auto-delete stale remote refs

[rebase]
    autoStash = true              # Auto stash/unstash during rebase

[merge]
    conflictstyle = zdiff3        # Better conflict display (shows common ancestor)

[diff]
    algorithm = histogram         # Better diff algorithm

[rerere]
    enabled = true                # Remember conflict resolutions

[gpg]
    format = ssh                  # Use SSH for signing

[commit]
    gpgsign = true                # Auto-sign commits

[alias]
    st = status -s
    co = checkout
    br = branch
    lg = log --oneline --graph --decorate --all
    ll = log --pretty=format:'%C(yellow)%h%Creset %C(green)%ad%Creset | %s%C(red)%d%Creset [%an]' --date=short
    undo = reset --soft HEAD~1
    last = log -1 HEAD --stat
    wip = !git add -A && git commit -m 'WIP: checkpoint'
    cleanup = "!git branch --merged | grep -v '\\*\\|main\\|master\\|develop' | xargs git branch -d"
    aliases = config --get-regexp alias
```

---

# Appendix C: Common Error Messages Decoded

| Error | What it means | How to fix |
|---|---|---|
| `fatal: not a git repository` | You're not inside a git repo | `cd` to the right directory or `git init` |
| `error: Your local changes would be overwritten` | You have local changes that conflict with the incoming merge/checkout | `git stash` or `git commit` first |
| `! [rejected] ... (non-fast-forward)` | Remote has commits you don't have | `git pull --rebase` then push |
| `CONFLICT (content): Merge conflict in file.js` | Two branches changed the same lines | Open file, resolve markers, `git add`, `git commit` |
| `detached HEAD state` | HEAD points to a commit, not a branch | `git checkout main` to go back, or `git checkout -b name` to save |
| `fatal: refusing to merge unrelated histories` | Trying to merge two repos with no common ancestor | `git pull --allow-unrelated-histories` (for legitimate merges) |
| `error: failed to push some refs` | Remote has changes you don't | `git pull --rebase` then push |
| `Your branch is ahead of 'origin/main' by N commits` | You have local commits not yet pushed | `git push` |
| `Your branch is behind 'origin/main' by N commits` | Remote has commits you haven't pulled | `git pull` |
| `pathspec 'file.js' did not match any files` | File doesn't exist or wrong path | Check `git status` and the exact filename |
| `Cannot rebase: You have unstaged changes` | Working directory is dirty | `git stash` or `git commit` first |
| `rebase in progress; onto` | A rebase was interrupted | Fix conflicts then `git rebase --continue`, or `git rebase --abort` |
| `nothing to commit, working tree clean` | No changes to commit | Not an error — just informational |

---

# Appendix D: Recommended Tools

### Terminal Enhancements
- **Oh My Zsh + git plugin**: Shows current branch and status in your prompt
- **Starship prompt**: Fast, beautiful cross-shell prompt with git info
- **delta**: Better diff viewer (`brew install git-delta`, then set as Git pager)

```bash
# delta setup in ~/.gitconfig
[core]
    pager = delta
[delta]
    navigate = true
    light = false
    side-by-side = true
    line-numbers = true
```

### GUI Clients (When the CLI Isn't Enough)
- **GitHub Desktop**: Best for beginners, free, GitHub-integrated
- **Sourcetree**: Free, powerful, good for visualizing complex branch structures
- **GitKraken**: Beautiful, feature-rich (free for open source)
- **VS Code Built-in Git**: Good for simple operations without leaving your editor
- **Fork**: Native macOS/Windows, fast, great for daily work

### Diff and Merge Tools
- **VS Code**: Great built-in merge conflict resolution
- **Kaleidoscope** (macOS): The best visual diff/merge tool
- **vimdiff**: Built into Vim, works in terminal
- **meld**: Free, cross-platform visual diff

### Repo Analysis
- **git-quick-stats**: `brew install git-quick-stats` — contribution statistics
- **onefetch**: `cargo install onefetch` — beautiful repo summary in terminal
- **gitui**: `cargo install gitui` — terminal UI for Git

---

# Appendix E: The Mental Model Summary

If you only remember six things from this guide:

1. **Git stores snapshots, not diffs.** Each commit is a complete photo of your project. The `.git/objects/` folder holds everything.

2. **A branch is just a file containing a commit hash.** Creating one is free and instant. HEAD is another file that points to your current branch.

3. **Staging is intentional.** `git add` doesn't mean "I changed this." It means "I want this specific change in my next commit." Use it to build clean, focused commits.

4. **Revert for shared history. Reset for local history.** `git revert` adds a new "undo" commit — safe for shared branches. `git reset` moves the branch pointer backward — only for commits nobody else has.

5. **Reflog is your safety net.** Almost nothing is truly lost in Git. If you mess up, `git reflog` shows where you've been and lets you go back.

6. **Pull before you push. Commit small. Write real commit messages.** These three habits will make you the best-to-work-with engineer on any team.

---

*This guide covers Git 2.30+ and GitHub as of 2024-2025. Some commands (git switch, git restore) require Git 2.23+. For older systems, the equivalent git checkout commands are also provided throughout.*

*Maintainer note: If you find an error or missing topic, the source is version-controlled — open a PR.*
