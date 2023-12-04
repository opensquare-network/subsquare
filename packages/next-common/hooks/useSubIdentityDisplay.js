import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";

export default function useSubIdentityDisplay(address) {
  const api = useApi();
  const [_super, setSuper] = useState();
  const [parentIdentity, setParentIdentity] = useState();
  const [parentAccount, data] = _super?.unwrap() || [];

  const parentAddress = parentAccount?.toJSON();
  const subName = data?.asRaw?.toHuman() || "";
  const parentName =
    parentIdentity?.unwrap()?.info?.display?.asRaw?.toHuman() || "";

  useEffect(() => {
    if (!api || !address) {
      return;
    }
    api.query.identity?.superOf(address).then((result) => setSuper(result));
  }, [api, address]);

  useEffect(() => {
    if (!api || !parentAddress) {
      return;
    }
    api.query.identity
      ?.identityOf(parentAddress)
      .then((result) => setParentIdentity(result));
  }, [parentAddress]);

  return {
    displayParent: parentName,
    display: subName,
  };
}
