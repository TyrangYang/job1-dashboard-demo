import { createContext, FC, PropsWithChildren, useContext } from 'react';
import { OptionsFields } from '../fetchData';

const MetadataContext = createContext<{ dimensions: string[] } | undefined>(
  undefined,
);
const MetaDataProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MetadataContext.Provider value={{ dimensions: [...OptionsFields] }}>
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
