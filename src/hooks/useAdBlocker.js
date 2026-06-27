import { useEffect, useState } from 'react';

export function useAdBlocker() {
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const bait = document.createElement('div');
    bait.className = 'ad adsbox pub_300x250 pub_300x250m pub_728x90 text-ad';
    bait.style.cssText = 'width:1px;height:1px;position:absolute;top:-9999px;left:-9999px;';
    document.body.appendChild(bait);

    const timer = setTimeout(() => {
      const blocked =
        bait.offsetHeight === 0 ||
        bait.offsetWidth === 0 ||
        bait.offsetParent === null ||
        window.getComputedStyle(bait).display === 'none' ||
        window.getComputedStyle(bait).visibility === 'hidden';
      setDetected(blocked);
      if (bait.parentNode) bait.parentNode.removeChild(bait);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (bait.parentNode) bait.parentNode.removeChild(bait);
    };
  }, []);

  return detected;
}
