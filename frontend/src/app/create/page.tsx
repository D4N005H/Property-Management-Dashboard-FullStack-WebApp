/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { revalidateAndRedirect } from "@/app/actions";
import BuildingStep from "@/app/components/wizard/BuildingStep";
import GeneralInfoStep from "@/app/components/wizard/GeneralInfoStep";
import UnitsStep from "@/app/components/wizard/UnitsStep";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FormData {
  id?: string;
  managementType: string;
  name: string;
  propertyNumber: string;
  propertyManager: string;
  accountant: string;
  buildings: any[];
  units: any[];
}

interface CreatePropertyPageProps {
  initialData?: FormData;
  isEditMode?: boolean;
}

const emptyData: FormData = {
  managementType: "WEG",
  name: "",
  propertyNumber: "",
  propertyManager: "",
  accountant: "",
  buildings: [],
  units: []
};

export default function CreatePropertyPage({ initialData = emptyData, isEditMode = false }: CreatePropertyPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const updateData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBulkUpdate = (extractedData: any) => {
    setFormData((prev) => ({
      ...prev,
      ...extractedData.property,
      buildings: extractedData.buildings,
      units: extractedData.units
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const payload = {
      ...formData,
      buildings: {
        create: formData.buildings.map((building) => {
          const { id, propertyId, createdAt, updatedAt, units, ...restOfBuilding } = building;
          return {
            ...restOfBuilding,
            units: {
              create: formData.units
                .filter((unit: any) => unit.buildingIndex === building.buildingIndex || unit.buildingId === building.id)
                .map((unit: any) => {
                  const { id, buildingId, createdAt, updatedAt, buildingIndex, ...restOfUnit } = unit;
                  return {
                    unitNumber: restOfUnit.unitNumber || '',
                    floor: restOfUnit.floor || 'N/A',
                    entrance: restOfUnit.entrance || 'N/A',
                    coOwnershipShare: restOfUnit.coOwnershipShare || '0/1000',
                    sizeM2: Number(restOfUnit.sizeM2) || 0,
                    roomCount: Number(restOfUnit.roomCount) || 0,
                    unitType: restOfUnit.unitType || 'Unknown',
                    constructionYear: Number(restOfUnit.constructionYear) || new Date().getFullYear(),
                  };
                }),
            },
          };
        }),
      },
    };
    delete (payload as any).units;
    delete (payload as any).id;

    const url = isEditMode 
      ? `http://localhost:3000/properties/${formData.id}` 
      : 'http://localhost:3000/properties';
      
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save property: ${await response.text()}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving. Please check the console.");
      setIsSaving(false);
      return;
    }

    await revalidateAndRedirect();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link href={isEditMode ? `/property/${formData.id}` : "/"} className="text-gray-500 hover:text-gray-700 mr-4">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? `Edit ${formData.name}` : "Create New Property"}
          </h1>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>1. General Info</span>
            <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>2. Buildings</span>
            <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>3. Units</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {currentStep === 1 && (
          <GeneralInfoStep 
            data={formData} 
            updateData={updateData} 
            onBulkUpdate={handleBulkUpdate}
            onNext={() => setCurrentStep(2)} 
          />
        )}

        {currentStep === 2 && (
          <BuildingStep
            data={formData.buildings}
            updateData={(newBuildings) => updateData('buildings', newBuildings)}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <UnitsStep
            units={formData.units}
            buildings={formData.buildings}
            updateData={(newUnits) => updateData('units', newUnits)}
            onBack={() => setCurrentStep(2)}
            onSave={handleSave}
            isSaving={isSaving}
            isEditMode={isEditMode}
          />
        )}
      </div>
    </main>
  );
}