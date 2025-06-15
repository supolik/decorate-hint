import { render } from '@testing-library/react';
import { decorateHint } from '../decorateHint';
import '@testing-library/jest-dom';

describe('decorateHint', () => {
  const renderHint = (front: string, hint: string): HTMLElement => {
    const { container } = render(decorateHint({ front, hint }));
    return container;
  };

   const getParts = (container: HTMLElement): { before: string; highlighted: string; after: string } => {
    const span = container.querySelector('span');
    if (!span) return { before: '', highlighted: '', after: '' };

    const nodes = Array.from(span.childNodes);
    let before = '', highlighted = '', after = '';

    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!before) {
          before = node.textContent || '';
        } else {
          after += node.textContent || '';
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'B') {
        highlighted = node.textContent || '';
      }
    }

    return { before, highlighted, after };
  };

  it('should highlight the first matching word in the hint', () => {
    const { before, highlighted, after } = getParts(renderHint('bad', 'He was badly hurt'));
    expect(before).toBe('He was ');
    expect(highlighted).toBe('badly');
    expect(after).toBe(' hurt');
  });

  it('should remove stopwords from front before matching', () => {
    const { before, highlighted, after } = getParts(renderHint('the acumen', 'business acumen'));
    console.log({
      render: renderHint('the acumen', 'business acumen').innerHTML,
      before, highlighted, after
    })
    expect(before).toBe('business ');
    expect(highlighted).toBe('acumen');
    expect(after).toBe('');
  });

  it('should match word variations', () => {
    const { before, highlighted, after } = getParts(renderHint('to vex', 'What vexes you?'));
    expect(before).toBe('What ');
    expect(highlighted).toBe('vexes');
    expect(after).toBe(' you?');
  });

  it('should match exact words', () => {
    const { before, highlighted, after } = getParts(renderHint('commence', 'He commenced work yesterday'));
    expect(before).toBe('He ');
    expect(highlighted).toBe('commenced');
    expect(after).toBe(' work yesterday');
  });

  it('should match words after stopwords in hint', () => {
    const { before, highlighted, after } = getParts(renderHint('sprinkler', 'I left the sprinkler on'));
    expect(before).toBe('I left the ');
    expect(highlighted).toBe('sprinkler');
    expect(after).toBe(' on');
  });

  it('should return original hint if no match is found', () => {
    const { before, highlighted, after } = getParts(renderHint('nonexistent', 'This is a test'));
    expect(before).toBe('This is a test');
    expect(highlighted).toBe('');
    expect(after).toBe('');
  });

  it('should be case-insensitive', () => {
    const { before, highlighted, after } = getParts(renderHint('BAD', 'He was badly hurt'));
    expect(before).toBe('He was ');
    expect(highlighted).toBe('badly');
    expect(after).toBe(' hurt');
  });

  it('should only highlight the first match', () => {
    const { before, highlighted, after } = getParts(renderHint('bad', 'He was badly hurt by a bad person'));
    expect(before).toBe('He was ');
    expect(highlighted).toBe('badly');
    expect(after).toBe(' hurt by a bad person');
  });
}); 