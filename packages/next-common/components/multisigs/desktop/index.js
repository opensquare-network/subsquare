import { useSelector } from "react-redux";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import {
  multisigsIsLoadingSelector,
  myMultisigsSelector,
} from "next-common/store/reducers/multisigSlice";
import { AddressUser } from "next-common/components/user";
import { Approving, Call, Signatories, Status, When } from "../fields";
import columns from "./colmns";
import MultisigSignField from "../signField";

export default function DesktopList() {
  const myMultisigs = useSelector(myMultisigsSelector);
  const isLoading = useSelector(multisigsIsLoadingSelector);

  const rows = (myMultisigs?.items || []).map((multisig) => [
    <When
      key="when"
      height={multisig.when.height}
      index={multisig.when.index}
    />,
    <AddressUser key="address" add={multisig.address} maxWidth={200} />,
    <Call
      key="call"
      when={multisig.when}
      call={multisig.call}
      callHash={multisig.callHash}
      callHex={multisig.callHex}
    />,
    <Approving
      key="approving"
      approvals={multisig.approvals}
      threshold={multisig.threshold}
    />,
    <Signatories key="signatories" signatories={multisig.signatories} />,
    <Status
      key="status"
      name={multisig.state.name}
      args={multisig.state.args}
      updateAt={multisig.updateAt}
    />,
    <MultisigSignField key="signStatus" multisig={multisig} />,
  ]);

  return (
    <ScrollerX>
      <DataList
        loading={isLoading}
        columns={columns}
        rows={rows}
        noDataText="No current multisigs"
      />
    </ScrollerX>
  );
}
