import { useChain } from "next-common/context/chain";
import {
  fetchMyMultisigsCount,
  myMultisigsCountSelector,
} from "next-common/store/reducers/multisigSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { Title } from "./styled";

export default function MultisigsTitle({ active }) {
  const dispatch = useDispatch();
  const chain = useChain();
  const realAddress = useRealAddress();
  const myMultisigsCount = useSelector(myMultisigsCountSelector);

  useEffect(() => {
    dispatch(fetchMyMultisigsCount(chain, realAddress));
  }, [dispatch, chain, realAddress]);

  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      Multisigs
      {myMultisigsCount !== null && (
        <span className="text-textTertiary mx-1 text16Medium">
          {myMultisigsCount || 0}
        </span>
      )}
    </Title>
  );
}
