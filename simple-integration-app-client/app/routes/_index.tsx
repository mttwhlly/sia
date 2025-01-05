import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useState } from 'react'
// import { Provider } from '~/types/providers'
import ProviderSearch from '~/components/providerSearch'
import {ProviderTable} from '~/components/providerTable'

interface Provider {
  npi: string,
  address: string,
  name: string,
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
  const firstName = params.get('firstName')
  const lastName = params.get('lastName')
  const city = params.get('city')
  const state = params.get('state')

  const response = await fetch(
    `http://localhost:5204/providers?${params.toString()}`
  )
  const providers = await response.json()

  return json({ providers})
}

export default function Index() {
  const { providers } = useLoaderData<typeof loader>()

  return (
    <>
    <header className="p-6 mx-auto border-b">
      <h1 className="text-xl font-bold">Simple Integration Application</h1>
    </header>
    <main className="p-6 max-w-2xl mx-auto">
      <p className='pb-8 text-sm'>Search the NPPES directory for a healthcare provider using name or location details.</p>
      <ProviderSearch />
      {providers.length > 0 && (
      <ProviderTable providers={providers} />
      )}
    </main>
    </>
  )
}
