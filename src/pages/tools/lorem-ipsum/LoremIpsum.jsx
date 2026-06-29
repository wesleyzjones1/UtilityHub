import { useRef, useState, useEffect } from 'react';
import PageShell from '../../../templates/PageShell/PageShell';
import Textarea from '../../../components/ui/Textarea/Textarea';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import styles from './LoremIpsum.module.css';

const HOW_TO_USE = [
  'Choose the output type: paragraphs, sentences, or words.',
  'Set the count and click Generate.',
  'Copy the result with the Copy button.',
];

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim',
  'id', 'est', 'laborum',
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function makeSentence(wordCount) {
  const words = Array.from({ length: wordCount }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateText(type, count) {
  if (type === 'words') {
    const words = Array.from({ length: count }, randomWord);
    const groups = [];
    for (let i = 0; i < words.length; i += 10) {
      groups.push(words.slice(i, i + 10).join(' '));
    }
    return groups.join(' ');
  }

  if (type === 'sentences') {
    return Array.from({ length: count }, () => makeSentence(randInt(6, 12))).join(' ');
  }

  return Array.from({ length: count }, (_, pi) => {
    const sentenceCount = randInt(3, 5);
    return Array.from({ length: sentenceCount }, (_, si) => {
      const s = makeSentence(randInt(4, 10));
      if (si === 0 && pi === 0) {
        return s.charAt(0).toUpperCase() + s.slice(1);
      }
      return s;
    }).join(' ');
  }).join('\n\n');
}

export default function LoremIpsum({ page }) {
  const typeRef = useRef(null);
  const countRef = useRef(null);
  const [output, setOutput] = useState('');

  function generate() {
    const type = typeRef.current?.value || 'paragraphs';
    const count = Math.min(50, Math.max(1, parseInt(countRef.current?.value, 10) || 3));
    setOutput(generateText(type, count));
  }

  useEffect(() => {
    setOutput(generateText('paragraphs', 3));
  }, []);

  return (
    <PageShell page={page} howToUse={HOW_TO_USE}>
      <div className={styles.layout}>
        <div className={styles.controls}>
          <label className={styles.fieldLabel}>
            <span>Type</span>
            <select ref={typeRef} className={styles.select} aria-label="Output type">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </label>
          <label className={styles.fieldLabel}>
            <span>Count</span>
            <input
              ref={countRef}
              type="number"
              className={styles.input}
              aria-label="Count"
              min="1"
              max="50"
              defaultValue="3"
            />
          </label>
          <button
            type="button"
            className={styles.generateBtn}
            aria-label="Generate text"
            onClick={generate}
          >
            Generate
          </button>
        </div>

        <div className={styles.outputPanel}>
          <div className={styles.outputHeader}>
            <span className={styles.outputLabel}>Output</span>
            {output && <CopyButton value={output} size="sm" />}
          </div>
          <Textarea
            value={output}
            readOnly
            rows={10}
            aria-label="Generated text"
            placeholder="Generated text will appear here…"
          />
        </div>
      </div>
    </PageShell>
  );
}
