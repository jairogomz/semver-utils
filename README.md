# semver-utils

This is a sample repository that uses **release-it** for automatic versioning based on conventional commits, along with **Githooks** to ensure consistency in the use of conventional commits.

## Index

- [Tools](#tools)
- [Local Usage](#local-usage)
  - [Commit message format](#commit-message-format)
- [How Githooks and `npm run commit` help](#how-githooks-and-npm-run-commit-help)
- [CI/CD Pipeline](#cicd-pipeline)
- [Changelog & Releases](#changelog--releases)

## Tools

This project uses the following tools to keep the codebase clean and consistent:

- **Husky:** Manages Githooks (`pre-commit` and `commit-msg`) to automatically run scripts before committing changes.
- **Prettier:** Code formatting tool that ensures a consistent style across the codebase.
- **ESLint:** Analyzes code for errors and potential issues, following best practices and standards.
- **lint-staged:** Runs formatters and linters only on the files staged for commit.
- **Commitizen:** Facilitates interactive commit message creation following the conventional commits format.
- **Commitlint:** Validates that commit messages follow the conventional commit format.
- **release-it:** Automates versioning, changelog generation, and package publishing based on commit history.

## Local Usage

1. **Install dependencies** (this also configures Githooks automatically via Husky):
   ```bash
   pnpm install
   ```

2. **Stage your changes:**
   ```bash
   git add .
   ```

3. **Commit using Commitizen** (recommended, guided flow):
   ```bash
   npm run commit
   ```
   This launches an interactive prompt that walks you through building a valid conventional commit message — selecting a type, scope, description, and optional breaking-change notes — so you don't need to remember the exact syntax.

4. **Push your branch** and open a pull request as usual. Merges to `main` are what trigger the release pipeline (see below).

> You can also commit manually with `git commit -m "..."` if you already know the convention — Commitlint will validate the message regardless of how it was created.

### Commit message format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types: `fix`, `feat`, `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`. Any commit type can include a `BREAKING CHANGE` footer to signal a breaking change.

See the [Conventional Commits Specification](https://www.conventionalcommits.org/) for full details.

## How Githooks and `npm run commit` help

- **Githooks (via Husky)** act as a local safety net, running automatically at two points:
  - `pre-commit`: runs **lint-staged**, which formats and lints only the staged files — catching style/quality issues before they ever reach the repo.
  - `commit-msg`: runs **Commitlint**, rejecting the commit if the message doesn't follow the conventional format.
- **`npm run commit`** (Commitizen) removes the guesswork by generating a correctly formatted message for you, so commits pass the `commit-msg` hook on the first try and your commit history stays clean and consistent.

Together, these tools guarantee that every commit landing on `main` is well-formatted *before* it's even pushed — which is what makes automatic versioning in the CI pipeline possible.

## CI/CD Pipeline

The workflow `.github/workflows/release_and_publish.yml` runs automatically on every push to `main` (or manually via `workflow_dispatch`), and performs the full release process:

1. **Checkout & setup:** Checks out the full git history (`fetch-depth: 0`, required by release-it to analyze commits) and sets up pnpm + Node 22.
2. **Install, lint, build:** Installs dependencies with a frozen lockfile, lints, and builds the package.
3. **Release (`release-it --ci`):** Since every commit follows the conventional format (thanks to Commitlint/Commitizen), release-it can automatically:
   - Determine the next version number (patch/minor/major) based on commit types (`fix`, `feat`, `BREAKING CHANGE`).
   - Update `CHANGELOG.md` (see [Changelog & Releases](#changelog--releases)).
   - Create a Git tag and a GitHub release.
4. **Publish:** Configures the npm registry for the `@Org` scope pointing to GitHub Packages, then publishes the newly versioned package with `pnpm publish`.

In short: **conventional commits, enforced locally by Githooks, are what let the pipeline decide the version bump and publish automatically — with no manual versioning step.**

## Changelog & Releases

release-it can generate/update a `CHANGELOG.md` automatically, grouping entries by commit type (`feat`, `fix`, `BREAKING CHANGE`, etc.) using each commit's description — this is what documents *what changed* in every release.

A typical release-it + conventional-changelog setup does the following on each release:
1. Reads commits since the last tag.
2. Appends a new version section to `CHANGELOG.md`, listing changes grouped by type (e.g. "Features", "Bug Fixes", "BREAKING CHANGES").
3. Commits the updated `CHANGELOG.md`, creates a Git tag (e.g. `v1.2.0`), and pushes both.
4. Creates a GitHub Release using that same changelog section as the release notes.

This is why writing good, conventional commit descriptions matters: **the commit message *is* the changelog entry** — there's no separate manual step to document a release.
