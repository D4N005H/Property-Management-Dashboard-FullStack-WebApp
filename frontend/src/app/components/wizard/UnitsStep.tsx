"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Unit {
  unitNumber: string;
  unitType: string;
  floor: string;
  sizeM2: number;
  roomCount: number;
  buildingIndex: number;
  [key: string]: any;
}

interface Building {
  name: string;
  [key: string]: any;
}

interface UnitsStepProps {
  units: Unit[];
  buildings: Building[];
  updateData: (units: Unit[]) => void;
  onSave: () => void;
  onBack: () => void;
  isSaving: boolean;
  isEditMode: boolean;
}

export default function UnitsStep({ units, buildings, updateData, onSave, onBack, isSaving, isEditMode }: UnitsStepProps) {
  
  const handleChange = (index: number, field: keyof Unit, value: string | number) => {
    const newUnits = [...units];
    if (field === 'sizeM2' || field === 'roomCount' || field === 'buildingIndex') {
      newUnits[index][field] = Number(value) || 0;
    } else {
      newUnits[index][field] = value;
    }
    updateData(newUnits);
  };

  const addUnit = () => {
    const newUnit: Unit = {
      unitNumber: "",
      unitType: "Apartment",
      floor: "",
      sizeM2: 0,
      roomCount: 1,
      buildingIndex: 0,
    };
    updateData([...units, newUnit]);
  };

  const removeUnit = (index: number) => {
    const newUnits = units.filter((_, i) => i !== index);
    updateData(newUnits);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 3: Units Data</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Floor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size (m²)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rooms</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Building</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {units.map((unit, index) => (
                <tr key={index}>
                  <td className="px-2 py-1"><input type="text" value={unit.unitNumber} onChange={(e) => handleChange(index, 'unitNumber', e.target.value)} className="w-24" /></td>
                  <td className="px-2 py-1">
                    <select value={unit.unitType} onChange={(e) => handleChange(index, 'unitType', e.target.value)} className="w-32">
                      <option>Apartment</option>
                      <option>Office</option>
                      <option>Parking</option>
                      <option>Garden</option>
                    </select>
                  </td>
                  <td className="px-2 py-1"><input type="text" value={unit.floor} onChange={(e) => handleChange(index, 'floor', e.target.value)} className="w-32" /></td>
                  <td className="px-2 py-1"><input type="number" value={unit.sizeM2 ?? "N/A"} onChange={(e) => handleChange(index, 'sizeM2', e.target.value)} className="w-24" /></td>
                  <td className="px-2 py-1"><input type="number" value={unit.roomCount ?? "N/A"} onChange={(e) => handleChange(index, 'roomCount', e.target.value)} className="w-20" /></td>
                  <td className="px-2 py-1">
                    <select value={unit.buildingIndex} onChange={(e) => handleChange(index, 'buildingIndex', e.target.value)} className="w-40">
                      {buildings.map((building, bIndex) => (
                        <option key={bIndex} value={bIndex}>{building.name || `Building #${bIndex + 1}`}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1 text-center">
                    <button type="button" onClick={() => removeUnit(index)} className="text-gray-400 hover:text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={addUnit}
            className="w-full text-center px-4 py-2 border border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            + Add Another Unit
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium px-6 py-2 rounded-lg">
          &larr; Back
        </button>
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : (isEditMode ? 'Update Property' : 'Finish & Create Property')}
        </button>
      </div>
    </div>
  );
}