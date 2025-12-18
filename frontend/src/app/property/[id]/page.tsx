import { Property } from '@/types/property';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PropertyActions from './PropertyActions';
async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`http://localhost:3000/properties/${id}`, {
      cache: 'no-store',
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error('Failed to fetch property details');
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    return null;
  }
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const property = await getPropertyById(resolvedParams.id);

  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 block">
                &larr; Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              <p className="text-gray-500 mt-1">
                Property Number: {property.propertyNumber} | Type: {property.managementType}
              </p>
            </div>
            <PropertyActions propertyId={property.id} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-500">Property Manager</p>
              <p className="text-gray-900">{property.propertyManager}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Accountant</p>
              <p className="text-gray-900">{property.accountant}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {property.buildings?.map((building) => (
            <div key={building.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-800">{building.name}</h3>
                <p className="text-sm text-gray-600">{`${building.street} ${building.houseNumber}, ${building.zipCode} ${building.city}`}</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size (m²)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rooms</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {building.units.map((unit) => (
                      <tr key={unit.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{unit.unitNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{unit.unitType}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{unit.floor}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{unit.sizeM2.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{unit.roomCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}