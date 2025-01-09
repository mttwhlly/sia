# Architectural Requirements

This is a living document with the architectural requirements of the Simple Integration Application.

For more information, check out the [Project Spec](./project-spec.md).

## Influential Functional Requirements

- The list should be retrieved from an API at https://npiregistry.cms.hhs.gov/api-page
- The user should be able to enter any combination of First Name, Last Name, City and State
- The last name is required.
- The output should contain a grid with a set of results.

## Other Influencers

- Building the application with the following stack given they are used by the company in order to demonstrate familiarity with the technologies:
  - .NET
  - React
    - React Router
  - Docker
- Achieving performance is a key factor given the centrality of data fetching in the application.
- The application should be easy to use and intuitive.
- The application (and its code) need to be shared, so both the app and code should be deployed to a public URL.
