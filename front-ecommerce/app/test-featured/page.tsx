'use client';

import { markProductsAsFeaturedAction } from '@/actions/products';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function TestFeaturedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleMarkAsFeatured = async () => {
    setIsLoading(true);
    try {
      const response = await markProductsAsFeaturedAction();
      if (response.success) {
        setResult(`Success! Marked ${response.data.length} products as featured.`);
      } else {
        setResult(`Error: ${response.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Featured Products</h1>
      <Button 
        onClick={handleMarkAsFeatured} 
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? 'Marking as Featured...' : 'Mark Products as Featured'}
      </Button>
      {result && (
        <div className="p-4 bg-gray-100 rounded">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
} 