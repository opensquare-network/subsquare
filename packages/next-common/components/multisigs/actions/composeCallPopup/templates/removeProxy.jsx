import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import PreviousButton from "next-common/components/summary/newProposalButton/previousButton";
import { MapDataList } from "next-common/components/dataList";
import { useStepContainer } from "next-common/context/stepContainer";
import { useEffect, useState } from "react";
import MultisigPopupWrapper from "../multisigPopupWraper";
import { MyProxiesProvider } from "next-common/components/myProxies/context/myProxies";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import {
  delegateeColumn,
  typeColumn,
  useDelayBlockOrTimeColumn,
} from "next-common/components/myProxies/common/columns";
import RemoveProxyAction from "next-common/components/myProxies/operations/removeProxy";
import { usePopupOnClose } from "next-common/context/popup";

function RemoveProxyContent() {
  const [dataList, setDataList] = useState([]);
  const { goBack } = useStepContainer();
  const signerAccount = useSignerAccount();
  const onClose = usePopupOnClose();

  const { result, loading } = useSubStorage("proxy", "proxies", [
    signerAccount?.realAddress,
  ]);

  useEffect(() => {
    if (loading) {
      return;
    }

    try {
      const jsonData = result?.toJSON();
      const list = jsonData?.[0] || [];
      setDataList(list);
    } catch (error) {
      console.error(error);
    }
  }, [result, loading]);

  const delayBlockOrTimeColumn = useDelayBlockOrTimeColumn();
  const columns = [
    delegateeColumn,
    {
      ...typeColumn,
      className: "w-[160px]",
    },
    {
      ...delayBlockOrTimeColumn,
      className: "w-[180px]",
    },
    {
      name: "",
      className: "text-right w-20",
      render: (data) => <RemoveProxyAction data={data} onSubmitted={onClose} />,
    },
  ];

  return (
    <>
      <MapDataList
        loading={loading}
        noDataText="No proxy set"
        columnsDef={columns}
        data={dataList}
      />
      <div className="flex justify-between">
        <PreviousButton onClick={goBack} />
      </div>
    </>
  );
}

export default function RemoveProxy() {
  return (
    <MultisigPopupWrapper>
      <MyProxiesProvider>
        <RemoveProxyContent />
      </MyProxiesProvider>
    </MultisigPopupWrapper>
  );
}
