import {
  createContext,
  FC,
  PropsWithChildren,
  RefObject,
  useContext,
  useMemo,
  useRef,
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
  triggerFetch(key: string, extraPayload?: Record<string, string[]>): void;
  selectedValueMapRef: RefObject<Map<string, string[]>>;
}

const ControllerContext = createContext<CascadeFilterController | undefined>(
  undefined,
);

interface Props extends PropsWithChildren {
  parentToChildren: Record<string, string[]>;
  childToParent: Record<string, string[]>;
}
const ControllerProvider: FC<Props> = ({
  parentToChildren,
  childToParent,
  children,
}) => {
  const registryRef = useRef(new Map<string, APIsType>()); // filterKey => fetchOptions function
  const selectedValueMapRef = useRef(new Map<string, string[]>()); // filterKey => selected value
  const controller = useMemo(() => {
    return {
      selectedValueMapRef,
      register(key: string, apis: APIsType) {
        registryRef.current.set(key, apis);
      },

      unregister(key: string) {
        registryRef.current.delete(key);
      },

      triggerFetch(key: string, extraPayload: Record<string, string[]>) {
        const downstream = parentToChildren[key] || [];
        // console.log(key, parentToChildren, childToParent);
        // console.log({ downstream });
        downstream.forEach((depKey) => {
          const filter = registryRef.current.get(depKey);
          if (!filter) return;
          // console.log(filter);
          const parentKeys = childToParent[depKey] ?? [];
          // console.log(depKey, parentKeys);
          const payload = parentKeys.reduce<Record<string, string[]>>(
            (res, curKey) => {
              if (!selectedValueMapRef.current.has(curKey)) return res;
              else {
                return {
                  ...res,
                  [curKey]: selectedValueMapRef.current.get(curKey) as string[],
                };
              }
            },
            {},
          );
          // console.log(payload);
          filter.reset();
          filter.fetchOptions(payload);
        });
      },
    };
  }, [parentToChildren, childToParent]);
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
