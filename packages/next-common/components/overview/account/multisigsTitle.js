import { useChain } from "next-common/context/chain";
import {
  fetchMyMultisigsCount,
  myMultisigsCountSelector,
} from "next-common/store/reducers/multisigSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { Title } from "./styled";
import { useMultisigContext } from "next-common/components/multisigs/multisigContext";
import { fetchMultisigsCountList10Times } from "next-common/components/multisigs/common";

function MultisigsCount() {
  const dispatch = useDispatch();
  const chain = useChain();
  const realAddress = useRealAddress();
  const myMultisigsCount = useSelector(myMultisigsCountSelector);
  const { isRefetchCount, setIsRefetchCount } = useMultisigContext() || {};

  useEffect(() => {
    dispatch(fetchMyMultisigsCount(chain, realAddress));
  }, [dispatch, chain, realAddress]);

  useEffect(() => {
    if (isRefetchCount) {
      fetchMultisigsCountList10Times(dispatch, chain, realAddress).then(() => {
        // updated 10 time, do nothing
      });
      setIsRefetchCount(false);
    }
  }, [isRefetchCount, setIsRefetchCount, chain, realAddress, dispatch]);

  return (
    myMultisigsCount !== null && (
      <span className="text-textTertiary mx-1 text16Medium">
        {myMultisigsCount || 0}
      </span>
    )
  );
}

export default function MultisigsTitle({ active }) {
  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      Multisigs
      <MultisigsCount />
    </Title>
  );
}
