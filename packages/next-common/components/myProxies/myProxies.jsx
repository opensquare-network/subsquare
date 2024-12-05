import { MapDataList } from "next-common/components/dataList";
import { useEffect, useState } from "react";
import {
  delegateeColumn,
  typeColumn,
  useDelayBlockOrTimeColumn,
  removeColumn,
} from "./common/columns";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import HeaderPrompt from "next-common/components/profile/proxy/common/headerPrompt";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useMyProxiesContext } from "./context/myProxies";
import SetProxy from "./operations/setProxy";

export default function MyProxies() {
  const [dataList, setDataList] = useState([]);
  const { proxies, loading } = useMyProxiesContext();

  const delayBlockOrTimeColumn = useDelayBlockOrTimeColumn();
  const columns = [
    delegateeColumn,
    typeColumn,
    delayBlockOrTimeColumn,
    removeColumn,
  ];

  useEffect(() => {
    if (loading) {
      return;
    }

    setDataList(proxies);
  }, [proxies, loading]);

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
      </SignerPopupWrapper>
      <div className="flex justify-end">
        <SetProxy />
      </div>
    </SecondaryCard>
  );
}
