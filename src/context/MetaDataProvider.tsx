import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { DimensionType, MetaDataType } from './MetaDataType';
interface MetadataContextType {
  dimensions: DimensionType[];
  parentToChildren: Record<string, string[]>;
  childToParent: Record<string, string[]>;
}

const MetadataContext = createContext<MetadataContextType | undefined>(
  undefined,
);
const MetaDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [allDimensions, setAllDimensions] = useState<DimensionType[]>([]);
  const [parentToChildren, setParentToChildren] = useState<
    Record<string, string[]>
  >({});
  const [childToParent, setChildToParent] = useState<Record<string, string[]>>(
    {},
  );
  useEffect(() => {
    async function fetchMeta() {
      const response = await fetch(process.env.PUBLIC_URL + '/metaData.json');
      const { dimensions }: MetaDataType = await response.json();
      setAllDimensions(dimensions);

      const parentToChildren = dimensions.reduce<Record<string, string[]>>(
        (res, dim) => {
          if (dim.parent) {
            for (let parentKey of dim.parent) {
              res[parentKey] = [...(res[parentKey] ?? []), dim.key];
            }
          }

          return res;
        },
        {},
      ); // parent => [children]

      const childToParentTmp: Record<string, string[]> = {}; // child => [parent]
      Object.entries(parentToChildren).forEach(([parent, children]) => {
        for (let child of children) {
          childToParentTmp[child] = [
            ...(childToParentTmp[child] ?? []),
            parent,
          ];
        }
      });
      setChildToParent(childToParentTmp);
      setParentToChildren(parentToChildren);
    }
    fetchMeta();
  }, []);

  return (
    <MetadataContext.Provider
      value={{ dimensions: allDimensions, parentToChildren, childToParent }}
    >
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetaData = () => {
  const context = useContext(MetadataContext);
  if (context === undefined) throw new Error('metadata not exist');

  return context;
};

export default MetaDataProvider;
