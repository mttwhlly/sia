import { useState } from 'react'
import { Form, useSearchParams, useNavigation } from '@remix-run/react'
import { usStates } from '~/lib/constants'
import { Button } from '~/components/ui/button'
import { Card,
  CardContent,
  CardDescription,
  CardHeader } from '~/components/ui/card'
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
      const [searchParams] = useSearchParams()
      const navigation = useNavigation()
      const [selectedState, setSelectedState] = useState(searchParams.get('state') || '')

      const defaultFirstName = searchParams.get('firstName') || ''
      const defaultLastName = searchParams.get('lastName') || ''
      const defaultCity = searchParams.get('city') || ''

      const isLoading = navigation.state === "loading"
      
    return (
      <Card>
        <CardHeader>
          <CardDescription>Search for a US healthcare provider on the <a href="https://npiregistry.cms.hhs.gov/" >NPPES NPI Registry</a></CardDescription>
          </CardHeader>
          <CardContent>
        <Form
        method="get"
        className="grid gap-4"
        aria-labelledby="form-title"
      >
        <h2 id="form-title" className="sr-only">
          Provider Search Form
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              aria-describedby="firstName-help"
              defaultValue={defaultFirstName}
              className='capitalize'
            />
            <p id="firstName-help" className="text-xs text-gray-500">
              Enter your first name
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
              defaultValue={defaultLastName}
              className='capitalize'
            />
            <p id="lastName-help" className="text-xs text-gray-500">
              Enter your last name (this field is required)
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
              className="w-full p-2 border rounded capitalize"
              aria-describedby="city-help"
              defaultValue={defaultCity}
            />
            <p id="city-help" className="text-xs text-gray-500">
              Enter your city
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
              defaultValue={selectedState}
              onValueChange={setSelectedState}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Select a state</SelectLabel>
                        {usStates.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                                {state.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <p id="state-help" className="text-xs text-gray-500">
              Select your state from the dropdown
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-950"
          disabled={isLoading}
          aria-live="assertive"
          aria-describedby="submit-help"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>

        <p id="submit-help" className="sr-only">
          Press to submit the form and search for providers based on your
          criteria.
        </p>
      </Form>
      </CardContent>
      </Card>
  
    );
}