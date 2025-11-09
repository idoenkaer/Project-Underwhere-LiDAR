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

The project is built with React, TypeScript, and Vite.

1.  **Prerequisites:** Ensure you have Node.js (v18+) and npm installed.
2.  **Clone the repository:** `git clone <repo-url>`
3.  **Install dependencies:** `cd project-underwhere && npm install`
4.  **Run the development server:** `npm run dev`

The application will be available at `http://localhost:5173` with Hot Module Replacement (HMR) enabled for a fast development experience.

## Architectural Constraints & Best Practices

To ensure project stability, maintainability, and compatibility, all contributors must adhere to the following constraints:

### **1. Relative Import Paths Preferred**

**This is a critical rule.** While our build system (Vite) can support path aliases, the project standard is to use **relative import paths** (`./`, `../`) to maintain clarity and simplicity.

-   **DO:** Use relative import paths.
-   **DO NOT:** Introduce new path aliases (`@/`) without team consensus. This helps keep the setup simple and predictable for all contributors.

Pull requests introducing unapproved aliases may be rejected. This practice guarantees that our project structure remains easy to reason about.

### **2. Clean Architecture**

We adhere to the **Clean Architecture** pattern to ensure a clear separation of concerns. Please familiarize yourself with the structure:

-   **UI Layer (`/src/components`):** Contains all React components. Should be unaware of business logic.
-   **Application Layer (`/src/application/use-cases`):** Contains all application-specific business rules.
-   **Infrastructure Layer (`/src/infrastructure`):** Contains external concerns like data access, AI services, etc.

Dependencies must always point inwards (UI -> Application -> Infrastructure abstractions).

### **3. Accessibility**

All new UI components and features must adhere to our accessibility standards. This includes considerations for keyboard navigation, screen readers, color contrast, and motion sensitivity. For detailed guidelines, please review our **[Accessibility Statement](./ACCESSIBILITY.md)**.

## Testing & Validation Philosophy

We believe that robust testing is the foundation of scientific credibility and software quality. Our approach is a hybrid model that combines automated checks with manual, domain-specific validation.

-   **Automated Scripts:** We use automated checks for code quality and consistency.
    -   **Linting:** `npm run lint` ensures a consistent code style using ESLint.
    -   **Path Alias Checks:** `npm run scan:aliases` script runs to prevent disallowed import paths.
-   **Unit & Integration Tests:** `npm test` runs our automated test suite using Vitest to validate individual components and their interactions.
-   **Scientific Validation:** Our `Validation` module provides a dashboard for benchmarking algorithms against expert-reviewed, ground-truth datasets. This includes checks for data plausibility and scientific outliers.
-   **Manual Field Testing:** The `Field Test` module provides a guided, instrumented protocol for testing the application's core workflows in real-world conditions.

All contributors are expected to write tests for their code and participate in the manual validation process to ensure the application is not only functional but scientifically accurate and reliable.

## Performance Profiling

Performance is a core feature, especially for a tool designed for in-field use on mobile devices. Contributors are encouraged to be mindful of performance and to use standard browser and React DevTools to profile their changes.

-   **Use the Profiler:** Use the React DevTools Profiler to identify and optimize expensive component renders.
-   **Monitor Network:** Check the Network tab in your browser's dev tools to ensure API calls are efficient and assets are properly sized.
-   **Check for Leaks:** Use the Memory tab to check for potential memory leaks, especially in components with complex state or subscriptions.
-   **Use the Debug Module:** The in-app `Debug` module contains tools to simulate performance load. Use these to stress-test your changes before submitting a pull request.

## Plugin & Extension Development

The platform is designed to be extensible through a community-driven plugin ecosystem. To ensure the security and scientific validity of these extensions, all submissions must go through a formal vetting process.

For detailed information on how to build, submit, and review plugins, please see our comprehensive guide:

-   **[Plugin Vetting & Standards](./PLUGIN_VETTING.md)**

## Pre-Release Quality Assurance Checklist

To ensure every release is robust, high-quality, and trusted by our users, the following comprehensive audit must be performed before tagging a new version for release. This combines our automated suites with critical manual validation.

| Category         | Checks/Tests                            |
| ---------------- | --------------------------------------- |
| Codebase         | Lint, import/alias resolve, secrets     |
| UI/UX            | Accessibility, flow, contrast, a11y     |
| Data workflow    | Import/export, edge-cases, metadata     |
| API/Extensions   | Error handling, fuzz, auth, plugins     |
| Scientific rigor | Workflow cases, explainability, compare |
| Privacy/security | Compliance, user auth/zones             |
| Automated tests  | Unit, e2e, load/smoke                   |
| Manual tests     | Edge/UI, file, error, field cases       |

Running this complete sequence regularly ensures our app is ready for both field and institutional deployment.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. We are committed to fostering an open and welcoming environment.