import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Stethoscope } from 'lucide-react'
import ProviderSearch from '../components/providerSearch'
import ProviderTable from '../components/providerTable'
import type { Provider } from '../types/providers'

export const meta: MetaFunction = () => {
  return [
    { title: 'Provider Search' },
    { name: 'description', content: 'Find healthcare providers' },
  ]
}

// Constants
// const API_BASE_URL = 'http://localhost:5204'
const API_BASE_URL = 'https://occ8ko8kw44kckgk8sw8wk84.mttwhlly.cc'
const API_TIMEOUT = 5000 // 5 seconds timeout

// Type definitions
type ApiError = {
  name?: string;
  message: string;
  status?: number;
}

type LoaderData = {
  providers: Provider[];
  error: string | null;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url)
    const params = url.searchParams
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
    
    console.log('Fetching from URL:', `${API_BASE_URL}/providers?${params.toString()}`)
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/providers?${params.toString()}`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      
      clearTimeout(timeoutId)
      
      // Log response details for debugging
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const text = await response.text()
      console.log('Response text:', text)

      // Handle different status codes
      switch (response.status) {
        case 200:
          if (!text) {
            return json<LoaderData>({ providers: [], error: null })
          }
          try {
            const providers = JSON.parse(text) as Provider[]
            return json<LoaderData>({ providers, error: null })
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError)
            return json<LoaderData>({
              providers: [],
              error: 'Invalid data received from provider service'
            }, { status: 422 })
          }
          
        case 502:
          throw new Error('Provider service is temporarily unavailable')
          
        case 504:
          throw new Error('Provider service timed out')
          
        default:
          throw new Error(`Provider service error: ${response.status}`)
      }
    } catch (fetchError: unknown) {
      const error = fetchError as ApiError
      if (error.name === 'AbortError') {
        throw new Error('Request timed out')
      }
      throw fetchError
    }

  } catch (error: unknown) {
    console.error('Loader Error:', error)
    
    const apiError = error as ApiError
    
    // Determine appropriate status code
    let status = 500
    if (apiError.message.includes('timed out')) {
      status = 504
    } else if (apiError.message.includes('temporarily unavailable')) {
      status = 502
    }
    
    return json<LoaderData>({ 
      providers: [],
      error: apiError instanceof Error ? apiError.message : 'An unexpected error occurred'
    }, { 
      status,
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  }
}

export default function Index() {
  const { providers, error } = useLoaderData<typeof loader>()

  return (
    <>
      <header className="border-b">
        <h1 className="p-6 max-w-3xl mx-auto text-lg text-blue-900 font-bold">
          <Stethoscope className='inline pb-1' /> Provider Search
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
