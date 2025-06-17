'use client';

import { ReactElement } from 'react';
import { STOPWORDS } from "@/app/utils/constants";
import { Card } from "@/app/hooks/useCardsData";

type CardHint = Pick<Card, 'front' | 'hint'>;

const removeLeadingStopwords = (input: string): string => {
  const words = input.trim().split(/\s+/);
  while (words.length && STOPWORDS.includes(words[0].toLowerCase())) {
    words.shift();
  }
  return words.join(' ');
};

export const decorateHint = (card: CardHint): ReactElement => {
  const { front, hint } = card;

  const cleanedFront = removeLeadingStopwords(front.toLowerCase());
  const allWords = cleanedFront.split(/\s+/).filter(Boolean);

    // Filter out stopwords from the front words
  const contentWords = allWords.filter(word => !STOPWORDS.includes(word));
  const candidates = contentWords.length > 0 ? contentWords : allWords;

  for (const word of candidates) {
    // partial match
    const regex = new RegExp(`\\b(${word}[a-z]*)\\b`, 'i');
     // use original hint to preserve uppercase
    const match = regex.exec(hint);

    if (match && match.index !== undefined) {
      const index = match.index;
      const matchText = match[0];

      return (
        <span>
          {hint.slice(0, index)}
          <b>{matchText}</b>
          {hint.slice(index + matchText.length)}
        </span>
      );
    }
  }

  // original hint if no match found
  return <span>{hint}</span>;
};