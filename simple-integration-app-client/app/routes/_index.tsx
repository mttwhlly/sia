import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { useState } from 'react'
import { Provider } from '~/types/providers'
import ProviderSearch from '~/components/providerSearch'
import {ProviderTable} from '~/components/providerTable'

export const meta: MetaFunction = () => {
  return [
    { title: 'Simple Integration App' },
    { name: 'description', content: 'Find healthcare providers' },
  ]
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url)
  const params = url.searchParams

  if (!params.get('lastName')) return json({ providers: [] })

  const response = await fetch(
    `http://localhost:5204/providers?${params.toString()}`
  )
  const data = await response.json()
  return json({ providers: data.results || [] })
}

export default function Index() {
  const { providers } = useLoaderData<{ providers: Provider[] }>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const data = [
    {
      id: '1',
      name: 'Dr. John Doe',
      npiNumber: '1234567890',
      address: '123 Main St, Anytown, USA 12345',
    },
    {
      id: '2',
      name: 'Dr. Jane Smith',
      npiNumber: '0987654321',
      address: '456 Oak Ave, Somewhere, USA 67890',
    },
    {
      id: '3',
      name: 'Dr. Alice Johnson',
      npiNumber: '1122334455',
      address: '789 Pine Rd, Elsewhere, USA 13579',
    },
  ]

  return (
    <>        <header className="p-6 mx-auto border-b"><h1 className="text-xl font-bold">Simple Integration Application</h1></header>
    <main className="p-6 max-w-2xl mx-auto">
      <p className='pb-8 text-sm'>Search the NPPES directory for a healthcare provider using name or location details.</p>
      <ProviderSearch />
      {providers.length > 0 && (
      <ProviderTable providers={data} />
      )}

      {providers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">NPI</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Credentials</th>
                <th className="p-2 border">Address</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.number}>
                  <td className="p-2 border">{provider.number}</td>
                  <td className="p-2 border">
                    {provider.basic.first_name} {provider.basic.last_name}
                  </td>
                  <td className="p-2 border">{provider.basic.credential}</td>
                  <td className="p-2 border">
                    {provider.addresses?.map((address, index) => (
                      <div key={index} className="p-2 border">
                        {address.address_1}
                        <br />
                        {address.city}, {address.state} {address.postal_code}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
    </>
  )
}
