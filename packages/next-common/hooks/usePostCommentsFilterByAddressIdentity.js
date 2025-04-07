import useRefCallback from "./useRefCallback";
import { useChain } from "next-common/context/chain";
import fetchBatchIdentities from "next-common/components/data/common/fetchBatchIdentities";
import { useEffect, useState } from "react";

export default function usePostCommentsFilterByAddressIdentity(
  accountList = [],
) {
  const chain = useChain();
  const [identities, setIdentities] = useState({});
  const [loadingAddressIdentity, setLoadingAddressIdentity] = useState(false);

  const fetchIdentities = useRefCallback(async (chain, accountList) => {
    const identities = await fetchBatchIdentities(chain, accountList);
    
    return identities;
  });

  const isCommentWithIdenticalAddress = useRefCallback(
    (comment, identities) => {
      const address = comment.author?.address;

      return (
        address && Object.prototype.hasOwnProperty.call(identities, address)
      );
    },
  );

  useEffect(() => {
    (async () => {
      setLoadingAddressIdentity(true);
      let identities = await fetchIdentities(chain, accountList);
      setIdentities(identities);
      setLoadingAddressIdentity(false);
    })();
  }, [accountList, chain, fetchIdentities]);

  return { identities, isCommentWithIdenticalAddress, loadingAddressIdentity };
}
