import { useEffect, useRef } from 'react';
import type { DependencyList, EffectCallback } from 'react';

const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const unMountCb = effect();

    return unMountCb;
  }, deps);

  return;
};

export default useUpdateEffect;
