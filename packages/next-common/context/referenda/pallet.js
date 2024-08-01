import { createContext, useContext } from "react";

const ReferendaPalletContext = createContext();

export default ReferendaPalletContext;

export function ReferendaPalletProvider({ children, pallet = "referenda" }) {
  return (
    <ReferendaPalletContext.Provider value={{ pallet }}>
      {children}
    </ReferendaPalletContext.Provider>
  );
}

export function useReferendaPallet() {
  const { pallet } = useContext(ReferendaPalletContext);
  return pallet;
}
