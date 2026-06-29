import { useState, useCallback } from 'react';
import SinglePanelTemplate from '../../../templates/SinglePanelTemplate/SinglePanelTemplate';
import Select from '../../../components/ui/Select/Select';
import CopyButton from '../../../components/ui/CopyButton/CopyButton';
import styles from './UuidGenerator.module.css';

const HOW_TO_USE = [
  'Choose how many UUIDs you want to generate.',
  'Click "Generate" to create random version-4 UUIDs.',
  'Copy a single value with its copy button, or "Copy all" at once.',
];

const COUNT_OPTIONS = [
  { value: '1', label: '1 UUID' },
  { value: '5', label: '5 UUIDs' },
  { value: '10', label: '10 UUIDs' },
  { value: '25', label: '25 UUIDs' },
];

/** RFC-4122 v4 UUID, using crypto.randomUUID when available. */
function makeUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator({ page }) {
  const [count, setCount] = useState('5');
  const [uuids, setUuids] = useState(() => [makeUuid()]);

  const generate = useCallback(() => {
    const n = Number(count) || 1;
    setUuids(Array.from({ length: n }, makeUuid));
  }, [count]);

  return (
    <SinglePanelTemplate
      page={page}
      howToUse={HOW_TO_USE}
      topControls={
        <div className={styles.controls}>
          <Select label="Count" options={COUNT_OPTIONS} value={count} onChange={setCount} />
          <button type="button" className={styles.generateBtn} onClick={generate}>
            Generate
          </button>
        </div>
      }
    >
      <div className={styles.list}>
        {uuids.map((id, i) => (
          <div key={`${id}-${i}`} className={styles.row}>
            <code className={styles.uuid}>{id}</code>
            <CopyButton value={id} size="sm" />
          </div>
        ))}
      </div>
      {uuids.length > 1 && (
        <div className={styles.copyAll}>
          <CopyButton value={uuids.join('\n')} size="sm" label="Copy all" />
        </div>
      )}
    </SinglePanelTemplate>
  );
}
