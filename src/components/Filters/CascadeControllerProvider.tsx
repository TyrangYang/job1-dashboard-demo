import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

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

const ControllerContext = createContext<CascadeFilterController | undefined>(
  undefined,
);

interface Props extends PropsWithChildren {
  allDependencies: Record<string, string[]>;
}
const registry = new Map<string, APIsType>(); // filterKey => fetchOptions function
const ControllerProvider: FC<Props> = ({ allDependencies, children }) => {
  const controller = useMemo(() => {
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
  }, [allDependencies]);
  return (
    <ControllerContext.Provider value={controller}>
      {children}
    </ControllerContext.Provider>
  );
};

export const useCascadeFilterController = () => {
  const context = useContext(ControllerContext);

  if (!context) {
    throw new Error('cascade filter controller init failed');
  }

  return context;
};

export default ControllerProvider;
