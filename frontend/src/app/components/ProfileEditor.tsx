'use client';

import { useState, useEffect } from 'react'; 

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fullName: string, imageUrl: string) => void;
  currentFullName: string;
  currentImage: string;
}

export default function ProfileEditor({
  isOpen,
  onClose,
  onSave,
  currentFullName,
  currentImage,
}: ProfileEditorProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const [fullName, setFullName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFullName(currentFullName);
      setImageUrl(currentImage);
    }
  }, [isOpen, currentFullName, currentImage]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedImageUrl = imageUrl.replace(API_URL, '');
    onSave(fullName, normalizedImageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter image URL (optional)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
