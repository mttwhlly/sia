import { useState } from 'react'
import { Form, useSubmit } from '@remix-run/react'
import { usStates } from '~/utils/us-states'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue, } from '~/components/ui/select'


export default function ProviderSearch() {
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
            <Label
              htmlFor="firstName"
            //   className="block text-sm font-medium mb-1"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              aria-describedby="firstName-help"
            />
            <p id="firstName-help" className="text-xs text-gray-500">
              Enter your first name.
            </p>
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
            >
              Last Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              required
              type="text"
              aria-required="true"
              aria-describedby="lastName-help"
            />
            <p id="lastName-help" className="text-xs text-gray-500">
              Enter your last name (this field is required).
            </p>
          </div>

          <div>
            <Label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </Label>
            <Input
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
            <Label htmlFor="state" className="block text-sm font-medium mb-1">
              State
            </Label>
            <Select
              name="state"
              aria-describedby="state-help"
              aria-label="State"
            >
                <SelectTrigger>
                    <SelectValue>Select State</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Select a state</SelectLabel>
                        {usStates.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <p id="state-help" className="text-xs text-gray-500">
              Select your state from the dropdown.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={isSubmitting}
          aria-live="assertive"
          aria-describedby="submit-help"
        >
          Search Providers
        </Button>

        <p id="submit-help" className="sr-only">
          Press to submit the form and search for providers based on your
          criteria.
        </p>
      </Form>
    );
}