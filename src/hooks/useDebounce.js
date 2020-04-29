/* @flow */

import { useState, useEffect } from 'react';

/**
 * Use Debounce custom hooks
 * @param {string} value
 * @param {number} delay
 * @param {Function} callback
 */

const useDebounce = (value: any, delay: number, callback?: Function) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      if (typeof callback === 'function') {
        callback();
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
