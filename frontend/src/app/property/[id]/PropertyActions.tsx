"use client";

import { revalidateAndRedirect } from "@/app/actions";
import Link from "next/link";

export default function PropertyActions({ propertyId }: { propertyId: string }) {

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This action cannot be undone."
    );

    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:3000/properties/${propertyId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error("Failed to delete property.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting the property.");
        return;
      }

      await revalidateAndRedirect();
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Link 
        href={`/property/${propertyId}/edit`}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Edit Property
      </Link>
      <button
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Delete
      </button>
    </div>
  );
}