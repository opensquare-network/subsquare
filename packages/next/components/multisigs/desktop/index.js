import { useSelector } from "react-redux";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import NoBorderList from "next-common/components/styledList/noBorderList";
import {
  multisigsIsLoadingSelector,
  myMultisigsSelector,
} from "next-common/store/reducers/multisigSlice";
import { AddressUser } from "next-common/components/user";
import { Approving, Call, Signatories, Status, When } from "../fields";
import columns from "./colmns";

export default function DesktopList() {
  const myMultisigs = useSelector(myMultisigsSelector);
  const isLoading = useSelector(multisigsIsLoadingSelector);

  const rows = (myMultisigs?.items || []).map((multisig) => [
    <When key="when" {...multisig?.when} />,
    <AddressUser key="address" add={multisig.address} />,
    <Call key="call" {...multisig} />,
    <Approving key="approving" {...multisig} />,
    <Signatories key="signatories" {...multisig} />,
    <Status key="status" {...multisig?.state} />,
  ]);

  return (
    <ScrollerX>
      <NoBorderList
        loading={isLoading}
        columns={columns}
        rows={rows}
        noDataText="No current multisigs"
      />
    </ScrollerX>
  );
}
