import { useSelector } from "react-redux";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";
import { myMultisigsSelector } from "next-common/store/reducers/multisigSlice";
import { AddressUser } from "next-common/components/user";
import { Approving, Call, Signatories, Status, When } from "./fields";

export default function DesktopList() {
  const myMultisigs = useSelector(myMultisigsSelector);

  const columns = [
    {
      name: "Address",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "When",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Call",
      style: { textAlign: "left", minWidth: "280px" },
    },
    {
      name: "Approving",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Signatories",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
    {
      name: "Status",
      style: { textAlign: "left", width: "128px", minWidth: "128px" },
    },
  ];

  const rows = (myMultisigs?.items || []).map((multisig) => [
    <AddressUser key="address" add={multisig.address} />,
    <When key="when" {...multisig?.when} />,
    <Call key="call" {...multisig} />,
    <Approving key="approving" {...multisig} />,
    <Signatories key="signatories" {...multisig} />,
    <Status key="status" {...multisig?.state} />,
  ]);

  return (
    <ScrollerX>
      <NoBorderList
        loading={false}
        columns={columns}
        rows={rows}
        noDataText="No current multisigs"
      />
    </ScrollerX>
  );
}
