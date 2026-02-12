// import { createContext } from "react";

interface APIsType {
  fetchOptions: (
    extraFilters?: Record<string, string[]>,
    selected?: string[],
  ) => Promise<void>;
  reset: () => void;
}

export interface CascadeFilterController {
  register(key: string, apis: APIsType): void;
  unregister(key: string): void;
  triggerFetch(key: string, payload: Record<string, string[]>): void;
}
export function createCascadeController(
  allDependencies: Record<string, string[]>,
): CascadeFilterController {
  const registry = new Map<string, APIsType>(); // filterKey => fetchOptions function

  return {
    register(key: string, apis: APIsType) {
      registry.set(key, apis);
    },

    unregister(key: string) {
      registry.delete(key);
    },

    triggerFetch(key: string, payload: Record<string, string[]>) {
      const downstream = allDependencies[key] || [];
      // console.log(key, payload, allDependencies);
      // console.log({ downstream });
      downstream.forEach((depKey) => {
        const filter = registry.get(depKey);
        if (!filter) return;

        // console.log(filter);

        filter.reset();
        filter.fetchOptions(payload);
      });
    },
  };
}

// const createCascadeController = createContext<{controller: CascadeFilterController}|undefined>(undefined)

// useCascadeFilterController
