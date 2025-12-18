import { Property } from '@/types/property';
import Link from 'next/link';

// Fetches data from backend
async function getProperties(): Promise<Property[]> {
  try {
    const res = await fetch('http://localhost:3000/properties', {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch properties:', await res.text());
      throw new Error('Failed to fetch properties');
    }

    return res.json();
  } catch (error) {
    console.error("Error in getProperties:", error);
    return [];
  }
}

export default async function Dashboard() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your WEG and MV properties</p>
          </div>
          
          <Link 
            href="/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            + Create New Property
          </Link>
        </div>

        {/* Property List */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          {properties.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No properties found.</p>
              <p className="text-sm mt-2">Click the button above to add your first property.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {prop.propertyNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {prop.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        prop.managementType === 'WEG' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {prop.managementType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prop.propertyManager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/property/${prop.id}`} 
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}