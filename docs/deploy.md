# Deployment and CI/CD Best Practices

This document outlines the best practices for deploying, managing versions, and contributing to this project.

## 1. Deploying to GitHub Pages

GitHub Pages is a great way to host this project for free. Here’s a step-by-step guide to deploying the application to GitHub Pages.

### Step 1: Add `homepage` to `package.json`

Open your `package.json` file and add a `homepage` field:

```json
{
  "name": "mindmap_text",
  "version": "0.1.0",
  "private": true,
  "homepage": "https://<your-github-username>.github.io/mindmap_text",
  // ...
}
```

Replace `<your-github-username>` with your actual GitHub username.

### Step 2: Install `gh-pages`

Install the `gh-pages` package as a dev dependency:

```bash
npm install gh-pages --save-dev
```

### Step 3: Add Deploy Scripts to `package.json`

Add the following scripts to your `package.json` file:

```json
{
  "scripts": {
    // ...
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

The `predeploy` script will automatically run before the `deploy` script, ensuring that you are deploying the latest version of your application.

### Step 4: Deploy

Run the `deploy` script:

```bash
npm run deploy
```

This will build your application and push the contents of the `build` directory to a new `gh-pages` branch on your GitHub repository. GitHub will automatically serve the content of this branch.

### Step 5: Configure GitHub Repository

Go to your repository’s settings on GitHub, navigate to the “Pages” section, and make sure the source is set to the `gh-pages` branch.

## 2. CI/CD with GitHub Actions

Automating the deployment process with GitHub Actions will ensure that every push to the `main` branch is automatically deployed.

### Step 1: Create a Workflow File

Create a new file at `.github/workflows/deploy.yml` and add the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name. Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### Step 2: How it Works

*   **`on: push: branches: [ main ]`**: This workflow triggers on every push to the `main` branch.
*   **`actions/checkout@v3`**: This action checks out your repository.
*   **`actions/setup-node@v3`**: This action sets up the specified version of Node.js.
*   **`npm ci`**: This command installs the dependencies cleanly from `package-lock.json`.
*   **`npm run build`**: This command builds the application for production.
*   **`peaceiris/actions-gh-pages@v3`**: This action deploys the contents of the `build` directory to the `gh-pages` branch.

## 3. Version Management

We use semantic versioning (SemVer) to manage the version of this project. The version number is specified in the `package.json` file.

### Versioning Strategy

*   **MAJOR** version for incompatible API changes.
*   **MINOR** version for adding functionality in a backward-compatible manner.
*   **PATCH** version for backward-compatible bug fixes.

### How to Update the Version

Use the `npm version` command to update the version and create a git tag:

```bash
# For a patch release
npm version patch

# For a minor release
npm version minor

# For a major release
npm version major
```

After running `npm version`, remember to push the tags to the remote repository:

```bash
git push --tags
```

## 4. Pull Request Workflow

We use a feature branch workflow. All new features and bug fixes should be developed in a separate branch and then merged into `main` via a pull request.

### Step 1: Create a Feature Branch

Create a new branch from the `main` branch:

```bash
git checkout -b <feature-name>
```

### Step 2: Develop and Commit

Make your changes, commit them, and push the branch to the remote repository:

```bash
git add .
git commit -m "feat: add new feature"
git push -u origin <feature-name>
```

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages.

### Step 3: Create a Pull Request

Go to the GitHub repository and create a new pull request from your feature branch to the `main` branch.

### Step 4: Code Review and Merge

At least one other developer should review the pull request. Once the pull request is approved and all checks have passed, it can be merged into the `main` branch. Use the “Squash and merge” option to keep the commit history clean.
