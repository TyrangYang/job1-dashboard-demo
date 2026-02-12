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
}

const MetadataContext = createContext<MetadataContextType | undefined>(
  undefined,
);
const MetaDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [allDimensions, setAllDimensions] = useState<DimensionType[]>([]);
  useEffect(() => {
    async function fetchMeta() {
      const response = await fetch(process.env.PUBLIC_URL + '/metaData.json');
      const metaData: MetaDataType = await response.json();
      setAllDimensions(metaData.dimensions);
    }
    fetchMeta();
  }, []);

  return (
    <MetadataContext.Provider value={{ dimensions: allDimensions }}>
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
