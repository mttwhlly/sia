import { useState } from 'react'
import { Form } from '@remix-run/react'
import { usStates } from '~/utils/us-states'


export default function ProvidersSearchForm() {
      const [isSubmitting, setIsSubmitting] = useState(false)
    
    return (
        <Form
        method="get"
        className="grid gap-4 mb-8"
        aria-labelledby="form-title"
      >
        <h2 id="form-title" className="sr-only">
          Provider Search Form
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="w-full p-2 border rounded"
              aria-describedby="firstName-help"
            />
            <p id="firstName-help" className="text-xs text-gray-500">
              Enter your first name.
            </p>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
            >
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              required
              type="text"
              className="w-full p-2 border rounded"
              aria-required="true"
              aria-describedby="lastName-help"
            />
            <p id="lastName-help" className="text-xs text-gray-500">
              Enter your last name (this field is required).
            </p>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className="w-full p-2 border rounded"
              aria-describedby="city-help"
            />
            <p id="city-help" className="text-xs text-gray-500">
              Enter your city.
            </p>
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">
              State
            </label>
            <select
              id="state"
              name="state"
              className="w-full p-2 border rounded"
              aria-describedby="state-help"
              aria-label="State"
            >
              <option value="">Select State</option>
              {usStates.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <p id="state-help" className="text-xs text-gray-500">
              Select your state from the dropdown.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={isSubmitting}
          aria-live="assertive"
          aria-describedby="submit-help"
        >
          Search Providers
        </button>

        <p id="submit-help" className="sr-only">
          Press to submit the form and search for providers based on your
          criteria.
        </p>
      </Form>
    );
}