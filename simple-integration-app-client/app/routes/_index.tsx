import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Hospital } from 'lucide-react'
import ProviderSearch from '~/components/providerSearch'
import {ProviderTable} from '~/components/providerTable'

interface Provider {
  name: string,
  npi: string,
  address: string,
  city: string,
  state: string,
  zip: string,
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Simple Integration App' },
    { name: 'description', content: 'Find healthcare providers' },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const params = url.searchParams

  const response = await fetch(
    `http://localhost:5204/providers?${params.toString()}`
  )
  const providers = await response.json()

  return json({ providers})
}

export default function Index() {
  const { providers } = useLoaderData<typeof loader>()

  console.log(providers)

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
