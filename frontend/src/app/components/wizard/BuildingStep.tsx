"use client";

interface Building {
  name: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
}

interface BuildingStepProps {
  data: Building[];
  updateData: (buildings: Building[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BuildingStep({ data, updateData, onNext, onBack }: BuildingStepProps) {
  const handleChange = (index: number, field: keyof Building, value: string) => {
    const newBuildings = [...data];
    newBuildings[index][field] = value;
    updateData(newBuildings);
  };

  const addBuilding = () => {
    const newBuilding: Building = {
      name: "",
      street: "",
      houseNumber: "",
      zipCode: "",
      city: "",
    };
    updateData([...data, newBuilding]);
  };

  const removeBuilding = (index: number) => {
    const newBuildings = data.filter((_, i) => i !== index);
    updateData(newBuildings);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 2: Building Data</h2>

        <div className="space-y-8">
          {data.map((building, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg border relative">
              <h3 className="font-semibold text-gray-800 mb-4">Building #{index + 1}</h3>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeBuilding(index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Remove Building"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Building Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Building Name</label>
                  <input type="text" value={building.name} onChange={(e) => handleChange(index, 'name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                {/* Street */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street</label>
                  <input type="text" value={building.street} onChange={(e) => handleChange(index, 'street', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                {/* House Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">House Number</label>
                  <input type="text" value={building.houseNumber} onChange={(e) => handleChange(index, 'houseNumber', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                {/* ZIP Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input type="text" value={building.zipCode} onChange={(e) => handleChange(index, 'zipCode', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
                {/* City */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" value={building.city} onChange={(e) => handleChange(index, 'city', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Building Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={addBuilding}
            className="w-full text-center px-4 py-2 border border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            + Add Another Building
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-2">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium px-6 py-2 rounded-lg">
          &larr; Back
        </button>
        <button onClick={onNext} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Next: Units &rarr;
        </button>
      </div>
    </div>
  );
}