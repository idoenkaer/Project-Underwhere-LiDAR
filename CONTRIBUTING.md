# Contributing to Project Underwhere

First off, thank you for considering contributing! This project is an ambitious concept, and your help is invaluable in making it a reality.

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

## Architectural Style

We adhere to the **Clean Architecture** pattern to ensure a clear separation of concerns. Please familiarize yourself with the structure outlined in the `Roadmap` module within the application:

-   **UI Layer (`/components`):** Contains all React components. Should be unaware of business logic.
-   **Application Layer (`/application/use-cases`):** Contains all application-specific business rules.
-   **Infrastructure Layer (`/infrastructure`):** Contains external concerns like data access, AI services, etc.

Dependencies must always point inwards (UI -> Application -> Infrastructure abstractions).

**A Note on Imports:** To ensure consistent module resolution and prevent build issues, this project uses **relative import paths only** (`./`, `../`). Please do not use absolute or alias imports (e.g., `@/components/...`) as they are not configured in the project's environment.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. We are committed to fostering an open and welcoming environment.