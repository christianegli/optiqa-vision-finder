# System Architecture

## Overview
The Glasses Finder Wizard is a React-based single-page application that guides users through a lifestyle and vision needs questionnaire, then provides personalized eyewear recommendations using AI.

## Design Principles
1. **MVP First**: Focus on delivering the core questionnaire and AI-powered results.
2. **Simplicity**: Use React functional components and hooks for state management.
3. **Testability**: Each component is independently testable.

## Component Structure
- **GlassesFinderWizard**: Main wizard component, handles all steps, state, and results.
- **App**: Root component, renders the wizard.

## Data Flow
- User answers are stored in local React state.
- On completion, answers are sent to an AI API for recommendations.
- Results are displayed in the UI.

## Technology Choices
- **React**: Chosen for rapid UI development and ecosystem support.
- **Vite**: Fast build tool for modern React projects.
- **lucide-react**: For consistent, modern iconography. 