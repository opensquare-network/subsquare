import { Title } from "components/myvotes/styled";
import { useChain } from "next-common/context/chain";
import { useUser } from "next-common/context/user";
import {
  fetchMyMultisigsCount,
  myMultisigsCountSelector,
} from "next-common/store/reducers/multisigSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function MultisigsTitle({ active }) {
  const dispatch = useDispatch();
  const chain = useChain();
  const user = useUser();
  const address = user?.address;
  const myMultisigsCount = useSelector(myMultisigsCountSelector);

  useEffect(() => {
    dispatch(fetchMyMultisigsCount(chain, address));
  }, [dispatch, chain, address]);

  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      Multisigs{" "}
      <span className="text-textTertiary">{myMultisigsCount || 0}</span>
    </Title>
  );
}
