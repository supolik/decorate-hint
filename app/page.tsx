'use client';

import React from 'react';
import { decorateHint } from './utils/decorateHint';
import { useCardsData } from './hooks/useCardsData';
import Image from 'next/image';

export default function Home(): React.ReactElement {
  const { cards, loading, error } = useCardsData();

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading cards...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error.message}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Cards with Hints</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{card.front}</h2>
                {card.pronunciation && (
                  <p className="text-sm text-gray-500">{card.pronunciation}</p>
                )}
              </div>
              {card.svg && (
                <Image 
                  src={card.svg.url} 
                  alt={card.front}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              )}
            </div>
            <p className="text-gray-600 mb-4">{card.back}</p>
            {card.hint && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Hint:</h3>
                <div className="text-gray-700">
                  {decorateHint(card)}
                </div>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Known: {card.knownCount}</span>
                <span>Failed: {card.failCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
