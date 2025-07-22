# ADR-1: MVP Technology Stack
Date: 2024-06-07
Status: Accepted

## Context
We need a fast, modern, and maintainable way to build a single-page app for the Glasses Finder Wizard.

## Decision
Use React with Vite and TypeScript for the MVP. Use lucide-react for icons.

## Rationale
- React is widely adopted, easy to learn, and has a large ecosystem.
- Vite provides fast development and build times.
- TypeScript adds type safety and maintainability.
- lucide-react offers a modern, consistent icon set.

## Consequences
- Rapid prototyping and iteration.
- Easy onboarding for new developers.
- Good support for future enhancements.

## Alternatives Considered
- Next.js: Overkill for a simple SPA.
- Create React App: Slower and less modern than Vite. 