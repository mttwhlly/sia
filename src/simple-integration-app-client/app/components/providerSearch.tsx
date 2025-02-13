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
      const [searchParams, setSearchParams] = useSearchParams()
      const navigation = useNavigation()
      const [selectedState, setSelectedState] = useState(searchParams.get('state') || '')
      const [firstName, setFirstName] = useState(searchParams.get('firstName') || '')
      const [lastName, setLastName] = useState(searchParams.get('lastName') || '')
      const [city, setCity] = useState(searchParams.get('city') || '')
      
      const isLoading = navigation.state === "loading"
    
      const handleReset = () => {
        // Reset all form states
        setSelectedState('')
        setFirstName('')
        setLastName('')
        setCity('')
        
        // Clear URL parameters
        setSearchParams({})
      }
    
      const handleSubmit = (e) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (firstName) params.set('firstName', firstName)
        if (lastName) params.set('lastName', lastName)
        if (city) params.set('city', city)
        if (selectedState) params.set('state', selectedState)
        setSearchParams(params)
      }
          
      return (
        <Card>
          <CardHeader>
            <CardDescription>Search for a US healthcare provider on the <a className="underline" href="https://npiregistry.cms.hhs.gov/">NPPES NPI Registry</a></CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              method="get"
              className="grid gap-4"
              aria-labelledby="form-title"
              onSubmit={handleSubmit}
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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className='capitalize'
          />
            <p id="firstName-help" className="text-xs text-gray-500">
              Enter first name
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
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className='capitalize'
          />
            <p id="lastName-help" className="text-xs text-gray-500">
              Enter last name (this field is required)
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
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className='capitalize'
          />
            <p id="city-help" className="text-xs text-gray-500">
              Enter city
            </p>
          </div>

          <div>
            <Label htmlFor="state" className="block text-sm font-medium mb-1">
              State
            </Label>
            <Select
            name="state"
            value={selectedState}
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
              Select state from the dropdown
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

        <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="py-2 px-4 rounded"
            aria-describedby="reset-help"
          >
            Reset
          </Button>
        <p id="reset-help" className="sr-only">
          Press to reset the form
        </p>

        <p id="submit-help" className="sr-only">
          Press to submit the form and search for providers based on your
          criteria.
        </p>
      </Form>
      </CardContent>
      </Card>
  
    );
}