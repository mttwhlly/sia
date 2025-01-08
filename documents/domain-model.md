# Domain Model

## Entities

- `Provider`

## Attributes and Operations

### `Provider`

- First Name: string
- Last Name: string
- City: string
- State: string
- NPI: string

### `ProviderResults`

- Providers: ProviderResult[]

### `ProviderResult`

- Name: string
- Address: string
- City: string
- State: string
- NPI: string

## Relationships

- `ProviderResults` has many `ProviderResult`

