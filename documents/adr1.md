# ADR 1: Using React for Simple Integration Application

## Status

Accepted

## Context

As we prepare to begin development of the Simple Integration Application's web application, one key decision that we need to make is which UI framework we're going to use and what infrastructure we need to deploy it.

The objective is to create a robust, scalable, and performant web application that can meet our customers' needs efficiently, and given our tight timeline of 4 months, we need to be strategic about tech stack decisions to ensure rapid development and high-quality output.

## Decision

We have decided to use React as the framework for developing the Simple Integration Application and deploying it on Hetzner Cloud using Docker and Coolify.

## Consequences

### Positive Consequences

- **Common Ground with Interviewers:** Given that Paychex/ExpenseWire uses the .NET stack for backend development and React for frontend development, using the same stack for our customer web application will demonstrate familiarity with the technologies used by the company and align with their tech stack.

### Negative Consequences

- **Unnecessary Complexity:** ...

Overall, the decision to use React and .NET aligns well with my current capabilities, resources, and project requirements, allowing me to deliver a high-quality customer web application within the desired timeline, however, if the goal were to solve the given problem in the most simple way, static HTML/CSS with minimal JavaScript for the frontend with a minor API backend using Hono, Express, etc would be preferable.
