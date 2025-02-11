import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Hospital, ScanFace } from 'lucide-react'
import ProviderSearch from '~/components/providerSearch'
import ProviderTable from '~/components/providerTable'

export const meta: MetaFunction = () => {
  return [
    { title: 'Simple Integration App' },
    { name: 'description', content: 'Find healthcare providers' },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url)
    const params = url.searchParams
    
    console.log('Fetching from URL:', `https://occ8ko8kw44kckgk8sw8wk84.mttwhlly.cc/providers?${params.toString()}`)
    
    const response = await fetch(
      `https://occ8ko8kw44kckgk8sw8wk84.mttwhlly.cc/providers?${params.toString()}`
    )
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    // Even if response is not ok, try to get the response text for debugging
    const text = await response.text()
    console.log('Response text:', text)

    // Now check response status
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${text}`)
    }

    // Handle empty response
    if (!text) {
      console.log('Empty response received')
      return json({ providers: [], error: null })
    }

    // Try parsing JSON
    try {
      const providers = JSON.parse(text)
      console.log('Successfully parsed providers:', providers)
      return json({ providers, error: null })
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      // Log the first 200 characters of text to see what we're trying to parse
      console.log('Failed to parse text (first 200 chars):', text.substring(0, 200))
      return json({
        providers: [],
        error: 'Failed to parse provider data'
      }, { 
        status: 422  // Using 422 instead of 500 since this is a data processing error
      })
    }

  } catch (error) {
    console.error('Loader Error:', error)
    return json({ 
      providers: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { 
      status: 500 
    })
  }
}

export default function Index() {
  const { providers, error } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="border-b">
        <h1 className="p-6 max-w-3xl mx-auto text-lg text-blue-900 font-bold">
          <ScanFace className='inline pb-1' /> Simple Integration Application
        </h1>
      </header>
      <main className="p-6 max-w-3xl mx-auto">
        <ProviderSearch />
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {providers && (
          <ProviderTable providers={providers} />
        )}
      </main>
    </>
  )
}
