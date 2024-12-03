import { MapDataList } from "next-common/components/dataList";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import {
  delegateeColumn,
  typeColumn,
  useDelayBlockOrTimeColumn,
  removeColumn,
} from "./common/columns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import HeaderPrompt from "next-common/components/profile/proxy/common/headerPrompt";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import {
  fetchMyProxies,
  myProxiesSelector,
} from "next-common/store/reducers/myProxiesSlice";
import { useSelector, useDispatch } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";

export default function MyProxies() {
  const { proxies, total, loading } = useSelector(myProxiesSelector);
  const dispatch = useDispatch();
  const address = useRealAddress();
  const api = useContextApi();
  const [dataList, setDataList] = useState([]);

  const { page, component: pageComponent } = usePaginationComponent(
    total,
    defaultPageSize,
  );

  const delayBlockOrTimeColumn = useDelayBlockOrTimeColumn();
  const columns = [
    delegateeColumn,
    typeColumn,
    delayBlockOrTimeColumn,
    removeColumn,
  ];

  useEffect(() => {
    dispatch(fetchMyProxies(address, api));
  }, [dispatch, address, api]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(proxies?.slice(startIndex, endIndex));
  }, [proxies, page, loading]);

  return (
    <SecondaryCard className="space-y-4">
      <HeaderPrompt
        content={
          "I'm a delegator and my delegatees can submit extrinsics on behalf of me."
        }
      />
      <SignerPopupWrapper>
        <MapDataList
          loading={loading}
          noDataText="No proxy set"
          columnsDef={columns}
          data={dataList}
        />
        {total > 0 && pageComponent}
      </SignerPopupWrapper>
    </SecondaryCard>
  );
}
