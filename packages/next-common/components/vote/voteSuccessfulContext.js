import React from "react";

const VoteSuccessfulContext = React.createContext();

export function VoteSuccessfulProvider({ VoteSuccessfulPopup, children }) {
  const [addressVote, setAddressVote] = React.useState(null);
  const [addressDelegations, setAddressDelegations] = React.useState(null);
  const [isShow, setIsShow] = React.useState(false);

  return (
    <VoteSuccessfulContext.Provider
      value={{ setAddressVote, setAddressDelegations, setIsShow }}
    >
      {children}
      {isShow && (
        <VoteSuccessfulPopup
          addressVote={addressVote}
          addressDelegations={addressDelegations}
          onClose={() => setIsShow(false)}
        />
      )}
    </VoteSuccessfulContext.Provider>
  );
}

export function useShowVoteSuccessful() {
  const { setAddressVote, setAddressDelegations, setIsShow } = React.useContext(
    VoteSuccessfulContext,
  );
  return React.useCallback(
    (addressVote, addressDelegations) => {
      setAddressVote(addressVote);
      setAddressDelegations(addressDelegations);
      setIsShow(true);
    },
    [setAddressVote, setIsShow, setAddressDelegations],
  );
}
