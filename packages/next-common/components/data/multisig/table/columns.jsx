import {
  Approving,
  Call,
  Signatories,
  Status,
  When,
} from "next-common/components/multisigs/fields";
import AddressUser from "next-common/components/user/addressUser";

const whenColumn = {
  name: "When",
  style: { textAlign: "left", width: "120px", minWidth: "120px" },
  key: "when",
  render: ({ when }) => <When height={when.height} index={when.index} />,
};

const multisigAddressColumn = {
  name: "Address",
  style: {
    textAlign: "left",
    width: "200px",
    minWidth: "200px",
    paddingRight: "16px",
  },
  key: "address",
  render: ({ address }) => <AddressUser add={address} maxWidth={200} />,
};

const desktopCallColumn = {
  name: "Call",
  style: { textAlign: "left", minWidth: "256px" },
  key: "call",
  render: (item) => (
    <Call
      when={item.when}
      call={item.call}
      callHash={item.callHash}
      callHex={item.callHex}
    />
  ),
};

const approvingColumn = {
  name: "Approving",
  style: { textAlign: "left", width: "120px", minWidth: "120px" },
  key: "approving",
  render: (item) => (
    <Approving approvals={item.approvals} threshold={item.threshold} />
  ),
};

const signatoriesColumn = {
  name: "Signatories",
  style: { textAlign: "left", width: "120px", minWidth: "120px" },
  key: "signatories",
  render: (item) => <Signatories signatories={item.signatories} />,
};

const statusColumn = {
  name: "Status",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  key: "status",
  isCustomStatus: true,
  render: (item) => <Status name={item.state.name} args={item.state.args} />,
};

const mobileCallColumn = {
  name: "Call",
  style: { textAlign: "right", minWidth: "256px" },
  key: "call",
  render: (item) => (
    <Call
      when={item.when}
      call={item.call}
      callHash={item.callHash}
      callHex={item.callHex}
      right
    />
  ),
};

export const desktopColumns = [
  whenColumn,
  multisigAddressColumn,
  desktopCallColumn,
  approvingColumn,
  signatoriesColumn,
  statusColumn,
];

export const mobileColumns = [
  whenColumn,
  multisigAddressColumn,
  mobileCallColumn,
  approvingColumn,
  signatoriesColumn,
  statusColumn,
];
