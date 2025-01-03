import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import { usStates } from "~/utils/us-states";
import {Provider} from "~/types/providers";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const params = url.searchParams;
  
  if (!params.get("lastName")) return json({ providers: [] });

  const response = await fetch(
    `http://localhost:5204/providers?${params.toString()}`
  );
  const data = await response.json();
  return json({ providers: data.results || [] });
}

export default function Index() {
  const { providers } = useLoaderData<{ providers: Provider[] }>();
  const [isSubmitting, setIsSubmitting] = useState(false);


    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Form method="get" className="grid gap-4 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                name="firstName"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name*
              </label>
              <input
                name="lastName"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                City
              </label>
              <input
                name="city"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                State
              </label>
              <select
                name="state"
                className="w-full p-2 border rounded"
              >
                <option value="">Select State</option>
                {usStates.map(({value, label}) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            Search Providers
          </button>
        </Form>
  
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
                    <td className="p-2 border">
                      {provider.basic.credential}
                    </td>
                    <td className="p-2 border">
                      {provider.addresses[0]?.address_1}<br />
                      {provider.addresses[0]?.city}, {provider.addresses[0]?.state} {provider.addresses[0]?.postal_code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
}

