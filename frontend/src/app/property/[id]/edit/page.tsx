import CreatePropertyPage from "@/app/create/page";
import { Property } from "@/types/property";
import { notFound } from "next/navigation";

async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`http://localhost:3000/properties/${id}`, {
      cache: 'no-store',
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch property details');
    return res.json();
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    return null;
  }
}

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const propertyData = await getPropertyById(resolvedParams.id);

  if (!propertyData) {
    notFound();
  }

  const processedData = {
    ...propertyData,
    units: propertyData.buildings?.flatMap((building, buildingIndex) => 
      building.units.map(unit => ({ ...unit, buildingIndex }))
    ) || [],
  };

  return <CreatePropertyPage initialData={processedData} isEditMode={true} />;
}