/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

interface GeneralInfoStepProps {
  data: any;
  updateData: (key: string, value: any) => void;
  onBulkUpdate: (data: any) => void;
  onNext: () => void;
}

export default function GeneralInfoStep({ data, updateData, onBulkUpdate, onNext }: GeneralInfoStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isExtracted, setIsExtracted] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      setUploadStatus("Uploading and analyzing PDF...");
      setIsExtracted(false);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:3000/properties/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const extractedData = await response.json();
        
        onBulkUpdate(extractedData);
        setUploadStatus("Success! Data extracted.");
        setIsExtracted(true);
      } catch (error) {
        console.error(error);
        setUploadStatus("Error extracting data from PDF.");
        setIsExtracted(false);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 1: General Information</h2>

      <div className={`mb-8 p-6 border-2 border-dashed rounded-lg text-center transition-colors ${
        isUploading ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-200'
      }`}>
        <h3 className="text-sm font-medium text-blue-900">Upload Declaration of Division</h3>
        <p className="text-xs text-blue-600 mt-1 mb-4">Upload the PDF to auto-fill property details.</p>
        
        {isUploading ? (
          <div className="text-blue-600 font-medium animate-pulse">Processing PDF...</div>
        ) : (
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200"
          />
        )}
        
        {uploadStatus && (
          <p className={`mt-3 text-sm font-medium ${uploadStatus.includes("Success") ? "text-green-600" : "text-red-600"}`}>
            {uploadStatus}
          </p>
        )}
      </div>

      {isExtracted ? (
        <div className="space-y-4 p-6 bg-gray-50 rounded-lg border">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800">Extracted Information</h3>
            <button
              type="button"
              onClick={() => setIsExtracted(false)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><span className="font-medium text-gray-500">Name:</span> {data.name}</div>
            <div><span className="font-medium text-gray-500">Number:</span> {data.propertyNumber}</div>
            <div><span className="font-medium text-gray-500">Manager:</span> {data.propertyManager}</div>
            <div><span className="font-medium text-gray-500">Accountant:</span> {data.accountant}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Management Type</label>
            <select value={data.managementType} onChange={(e) => updateData("managementType", e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option value="WEG">WEG (Condominium)</option>
              <option value="MV">MV (Rental Property)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Name</label>
            <input type="text" required value={data.name} onChange={(e) => updateData("name", e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Number</label>
            <input type="text" required value={data.propertyNumber} onChange={(e) => updateData("propertyNumber", e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Manager</label>
              <input type="text" value={data.propertyManager} onChange={(e) => updateData("propertyManager", e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Accountant</label>
              <input type="text" value={data.accountant} onChange={(e) => updateData("accountant", e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next: Buildings &rarr;
        </button>
      </div>
    </form>
  );
}