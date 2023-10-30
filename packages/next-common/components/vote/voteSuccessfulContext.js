import React from "react";

const VoteSuccessfulContext = React.createContext();

export function VoteSuccessfulProvider({ VoteSuccessfulPopup, children }) {
  const [addressVote, setAddressVote] = React.useState(null);
  const [isShow, setIsShow] = React.useState(false);

  return (
    <VoteSuccessfulContext.Provider value={{ setAddressVote, setIsShow }}>
      {children}
      {isShow && (
        <VoteSuccessfulPopup
          addressVote={addressVote}
          onClose={() => setIsShow(false)}
        />
      )}
    </VoteSuccessfulContext.Provider>
  );
}

export function useShowVoteSuccessful() {
  const { setAddressVote, setIsShow } = React.useContext(VoteSuccessfulContext);
  return React.useCallback(
    (addressVote) => {
      setAddressVote(addressVote);
      setIsShow(true);
    },
    [setAddressVote, setIsShow],
  );
}
