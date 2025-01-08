# Simple Integration Application High-Level Design

## 1. Overview

This document outlines the high-level architecture design for Simple Integration Application for Paychex (ExpenseWire) interview.

This design document addresses the architectural requirements, provides a high-level design, considers alternatives, and outlines a timeline for implementation.

## 2. Context

![System Context Diagram](./assets/system-context-diagram.png)

## 3. Goals and Non-Goals

### Goals

- **Scalability**: Design an architecture that can support a growing team and an increasing number of users.
- **Modularity**: Ensure the codebase is modular to allow multiple developers to work in parallel without conflicts.
- **Performance**: Optimize the application for quick load times and smooth user interactions, especially on mobile devices.
- **Accessibility**: Ensure compliance with WCAG 2.2 accessibility standards.
- **Security**: Implement best practices for securing user data.

### Non-Goals

- **CI/CD Pipeline**: While important, setting up a full CI/CD pipeline is out of scope for this document.
- **User Authentication**: User authentication is not required for this application.
- **Internationalization**: While important for a global audience, internationalization is not a priority for this application.
- **SEO Optimization**: While important for discoverability, SEO optimization is not a priority for this application.

## 4. High Level Design

We're going to build the Simple Integration Application in a monorepo with React frontend and .NET backend. The frontend will be a server-side rendered application using React Router (Remix) for improved performance. We'll use TypeScript for type safety and better developer experience. The application will be deployed using Docker on Coolify and Hetzner Cloud. Unit tests for the backend will be written using MSTest and for the frontend using Storybook and Jest.

### Container Diagram

![Container Diagram](./assets/container-diagram.png)

### Architectural Style

- **Component-Based Architecture**: Utilize a component-based architecture using React to create reusable UI components.
- **Server-Side Rendered Application**: Use React Router for server-side rendering (and client-side rendering where appropriate) and improved performance and responsiveness.
- **Monorepo**: Develop our frontend apps and packages in a monorepo to speed up development and remove friction when sharing code.
- **TypeScript**: Use TypeScript for type safety and better developer experience, while allowing gradual adoption to accommodate all team members.
- **Docker**: Use Docker for containerization to ensure consistency across development, testing, and production environments.
- **Coolify**: Deploy the application on Coolify for easy scaling and management.
- **Hetzner Cloud**: Host the application on Hetzner Cloud for reliable and performant infrastructure.

### Key Components

1. **Search Module**: Allows users to search for healthcare provider(s) based on various criteria.

### Technology Stack

- **Frontend**: React, React Router, TypeScript, Tailwind CSS, shadcn/ui, Storybook
- **Backend**: .NET Core
- **Deployment**: Docker, Coolify, Hetzner Cloud

## 5. Alternatives Considered

1. **Vanilla HTMl/CSS with minimal JS**: Given the simplicity of the acceptance criteria, removing all overhead could achieve a quality result with maximum simplicity. While preferential, using a framework in use by the company would demonstrate familiarity with the technologies.
2. **Next.js**: Although Next.js provides a pleasant developer experience, it is not used by the company (heavily .NET for backend especially) and includes drawbacks if not using Vercel hosting (and high costs at scale if using).

### Open Questions

- **Programming language/framework approach**: How does the team approach the decision to use a new framework or language?
- **User experience**: How does the way the application is used by the end user affect the decision to use a specific technology and implement features?

## 8. Appendix

### References

- [Figma UI Designs (for shadcn/ui)](https://www.shadcndesign.com/)
- [Architectural Requirements Document](./architectural-requirements.md)
- [Domain Model](./domain-model.md)
- [ADR1: Using React and .NET](./adr1.md)
