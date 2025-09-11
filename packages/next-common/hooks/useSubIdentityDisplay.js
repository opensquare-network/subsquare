import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useSubIdentityDisplay(address) {
  const api = useContextApi();
  const [_super, setSuper] = useState();
  const [parentIdentity, setParentIdentity] = useState();
  const [parentAccount, data] = _super?.unwrap() || [];
  const [isLoading, setIsLoading] = useState(true);

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
    api.query.identity?.identityOf(parentAddress).then((result) => {
      setParentIdentity(result);
      setIsLoading(false);
    });
  }, [api, parentAddress]);

  return {
    isLoading,
    displayParent: parentName,
    display: subName,
  };
}
