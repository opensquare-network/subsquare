import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";

function TicketCell({ ticket }) {
  const { decimals, symbol } = useChainSettings();
  if (isNil(ticket)) {
    return null;
  }
  return <ValueDisplay value={toPrecision(ticket, decimals)} symbol={symbol} />;
}

export const desktopColumns = [
  {
    name: "Inheritor",
    className: "min-w-[200px] text-left",
    render: (item) => (
      <AddressUser key="inheritor" add={item.inheritor} maxWidth={200} />
    ),
  },
  {
    name: "Lost Account",
    className: "min-w-[200px] text-left",
    render: (item) => (
      <AddressUser key="account" add={item.account} maxWidth={200} />
    ),
  },
  {
    name: "Group Index",
    className: "w-[120px] text-left",
    render: (item) => (
      <span className="text14Medium text-textPrimary">#{item.groupIndex}</span>
    ),
  },
  {
    name: "Depositor",
    className: "min-w-[200px] text-left",
    render: (item) => (
      <AddressUser key="depositor" add={item.depositor} maxWidth={200} />
    ),
  },
  {
    name: "Ticket",
    className: "w-[180px] text-right",
    render: (item) => <TicketCell ticket={item.ticket} />,
  },
];

export const mobileColumns = [
  {
    name: "Inheritor",
    className: "text-left",
    render: (item) => <AddressUser add={item.inheritor} maxWidth={120} />,
  },
  {
    name: "Lost Account",
    className: "text-left",
    render: (item) => <AddressUser add={item.account} maxWidth={160} />,
  },
  {
    name: "Group Index",
    className: "text-right",
    render: (item) => (
      <span className="text14Medium text-textTertiary">#{item.groupIndex}</span>
    ),
  },
  {
    name: "Depositor",
    className: "text-left",
    render: (item) => <AddressUser add={item.depositor} maxWidth={120} />,
  },
  {
    name: "Ticket",
    className: "text-right",
    render: (item) => <TicketCell ticket={item.ticket} />,
  },
];
