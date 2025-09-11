import { useProfileMultisigsDataContext } from "next-common/components/profile/multisigs/context/profileMultisigsDataContext";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import { AddressUser } from "next-common/components/user";
import { sortAddresses } from "@polkadot/util-crypto";
import { useChainSettings } from "next-common/context/chain";
import { useMemo } from "react";

export default function Signatories() {
  const { data, loading } = useProfileMultisigsDataContext();
  const { ss58Format } = useChainSettings();

  const sortedSignatories = useMemo(() => {
    return sortAddresses(data?.signatories || [], ss58Format);
  }, [data?.signatories, ss58Format]);

  const rows = sortedSignatories.map((signatory) => [
    <AddressUser key={signatory} add={signatory} className="text14Medium" />,
  ]);

  const columns = [
    {
      name: "Signatories",
      className: "w-full",
    },
  ];

  return (
    <ScrollerX>
      <DataList
        loading={loading}
        columns={columns}
        rows={rows}
        noDataText="No signatories found"
      />
    </ScrollerX>
  );
}
