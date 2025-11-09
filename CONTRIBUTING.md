# Contributing to Project Underwhere

First off, thank you for considering contributing! This project is a community-driven, open-source initiative, and your help is invaluable in making our ambitious vision a reality.

## How to Contribute

The best way to contribute is by creating issues or pull requests. Whether you're fixing a bug, adding a new feature, or improving documentation, every contribution is welcome.

### Pull Request Process

1.  Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2.  Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3.  Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4.  You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Development Setup

The project is built with React and TypeScript, using a simple `index.html` and `index.tsx` structure with ES modules. There is no complex build system.

1.  Clone the repository.
2.  Open `index.html` in your browser to run the application.
3.  Modify `*.tsx` files as needed. Changes will be reflected upon browser refresh.

## Architectural Constraints & Best Practices

To ensure project stability, maintainability, and compatibility with our "zero-setup" environment, all contributors must adhere to the following constraints:

### **1. Relative Import Paths Only**

**This is a critical rule.** The project's simple environment does not use a build tool with path alias resolution (e.g., Webpack, Vite). Therefore:

-   **DO:** Use relative import paths (`./`, `../`).
-   **DO NOT:** Use absolute or aliased paths (e.g., `src/components/...` or `@/components/...`).

Pull requests containing aliased paths will not be merged. This practice guarantees that the project runs correctly out-of-the-box in any browser without configuration.

### **2. Clean Architecture**

We adhere to the **Clean Architecture** pattern to ensure a clear separation of concerns. Please familiarize yourself with the structure:

-   **UI Layer (`/components`):** Contains all React components. Should be unaware of business logic.
-   **Application Layer (`/application/use-cases`):** Contains all application-specific business rules.
-   **Infrastructure Layer (`/infrastructure`):** Contains external concerns like data access, AI services, etc.

Dependencies must always point inwards (UI -> Application -> Infrastructure abstractions).

## Testing & Validation Philosophy

We believe that robust testing is the foundation of scientific credibility and software quality. Our approach is a hybrid model that combines automated checks with manual, domain-specific validation.

-   **Automated Scripts:** We use automated checks for code quality and consistency.
    -   **Linting:** `eslint` ensures a consistent code style.
    -   **Path Alias Checks:** The `scripts/checkAliases.js` script runs pre-commit to prevent disallowed import paths.
-   **Unit & Integration Tests:** A comprehensive suite of automated tests (using Jest/Vitest) validates individual components and their interactions.
-   **Scientific Validation:** Our `Validation` module provides a dashboard for benchmarking algorithms against expert-reviewed, ground-truth datasets. This includes checks for data plausibility and scientific outliers.
-   **Manual Field Testing:** The `Field Test` module provides a guided, instrumented protocol for testing the application's core workflows in real-world conditions.

All contributors are expected to write tests for their code and participate in the manual validation process to ensure the application is not only functional but scientifically accurate and reliable.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. We are committed to fostering an open and welcoming environment.