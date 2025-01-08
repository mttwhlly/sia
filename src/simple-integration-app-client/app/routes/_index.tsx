import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Hospital } from 'lucide-react'
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

  const response = await fetch(
    `https://z880ssckg4s4okwggsk8wswg.mttwhlly.cc/?${params.toString()}`
  )
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      // Get the text first to help debug any JSON parsing issues
      const text = await response.text()
      
      // Handle empty response
      if (!text) {
        return json({ providers: [] })
      }
  
      try {
        const providers = JSON.parse(text)
        return json({ providers })
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Response:', text)
        return json({ providers: [] }, { status: 500 })
      }
} catch (error) {
  console.error('Loader Error:', error)
    return json({ providers: [] }, { status: 500 })
}
}

export default function Index() {
  const { providers } = useLoaderData<typeof loader>()

  return (
    <>
    <header className="border-b">
      <h1 className="p-6 max-w-2xl mx-auto text-lg text-blue-900 font-bold"><Hospital className='inline pb-1' /> Simple Integration Application</h1>
    </header>
    <main className="p-6 max-w-2xl mx-auto">
      <ProviderSearch />
      {providers.length > 0 && (
      <ProviderTable providers={providers} />
      )}
    </main>
    </>
  )
}
