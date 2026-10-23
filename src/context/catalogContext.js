import { createContext, useContext } from "react";

export const CatalogContext = createContext(null);
export const useCatalog = () => useContext(CatalogContext);
