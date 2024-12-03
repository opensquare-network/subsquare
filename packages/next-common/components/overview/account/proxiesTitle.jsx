import { Title } from "./styled";
import {
  fetchMyProxies,
  myProxiesSelector,
} from "next-common/store/reducers/myProxiesSlice";
import { useSelector, useDispatch } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";
import { useEffect } from "react";

function ProxiesCount() {
  const { total } = useSelector(myProxiesSelector);
  const dispatch = useDispatch();
  const address = useRealAddress();
  const api = useContextApi();

  useEffect(() => {
    dispatch(fetchMyProxies(address, api));
  }, [dispatch, address, api]);

  return <span className="text-textTertiary mx-1 text16Medium">{total}</span>;
}

export default function ProxiesTitle({ active }) {
  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      Proxies
      <ProxiesCount />
    </Title>
  );
}
