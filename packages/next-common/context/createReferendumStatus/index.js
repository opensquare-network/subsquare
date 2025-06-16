import { createContext, useContext, useState } from "react";

const CreateReferendumStatusContext = createContext();

export function CreateReferendumStatusProvider({
  children,
  closeInputPopup,
  closeStatusPopup,
  openStatusPopup,
}) {
  const [createParams, setCreateParams] = useState(null);

  return (
    <CreateReferendumStatusContext.Provider
      value={{
        createParams,
        setCreateParams,
        closeInputPopup,
        closeStatusPopup,
        openStatusPopup,
      }}
    >
      {children}
    </CreateReferendumStatusContext.Provider>
  );
}

export function usePopupActions() {
  const {
    closeInputPopup,
    closeStatusPopup,
    openStatusPopup,
    createParams,
    setCreateParams,
  } = useContext(CreateReferendumStatusContext);

  return {
    closeInputPopup,
    closeStatusPopup,
    openStatusPopup,
    createParams,
    setCreateParams,
  };
}
