import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { useState } from 'react'
import { Provider } from '~/types/providers'
import ProvidersSearchForm from '~/components/providersSearchForm'

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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <ProvidersSearchForm />

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
    </div>
  )
}
