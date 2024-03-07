import dayjs from "dayjs";
import Descriptions from "next-common/components/Descriptions";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { cn, toPrecision } from "next-common/utils";

export function useFellowshipSalaryCyclePaymentColumn() {
  return {
    name: "Payment",
    minWidth: 240,
    className: "min-w-[320px]",
    cellRender(data) {
      return <FellowshipSalaryCycleTabRegistrationPaymentCell data={data} />;
    },
  };
}

function FellowshipSalaryCycleTabRegistrationPaymentCellBeneficiary({ data }) {
  return <AddressUser add={data?.beneficiary} showAvatar={false} />;
}

function FellowshipSalaryCycleTabRegistrationPaymentCellAmount({ data }) {
  const { decimals, symbol } = useChainSettings();
  return (
    <ValueDisplay value={toPrecision(data?.amount, decimals)} symbol={symbol} />
  );
}

function FellowshipSalaryCycleTabRegistrationPaymentCellIndexer({ data }) {
  return (
    <span className="text-textTertiary">
      {dayjs(data?.paidIndexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
    </span>
  );
}

function FellowshipSalaryCycleTabRegistrationPaymentCell({
  data,
  className = "",
}) {
  if (!data?.isPaid) {
    return <span className="text-textTertiary text14Medium">-</span>;
  }

  const items = [
    {
      label: "beneficiary",
      value: (
        <FellowshipSalaryCycleTabRegistrationPaymentCellBeneficiary
          data={data}
        />
      ),
    },
    {
      label: "amount",
      value: (
        <FellowshipSalaryCycleTabRegistrationPaymentCellAmount data={data} />
      ),
    },
    {
      label: "indexer",
      value: (
        <FellowshipSalaryCycleTabRegistrationPaymentCellIndexer data={data} />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "[&_.descriptions-item]:h-auto",
        "[&_.descriptions-item]:justify-start [&_.descriptions-item]:max-sm:justify-between",
        "[&_.descriptions-item-label]:w-[132px] [&_.descriptions-item-label]:text-textTertiary",
        className,
      )}
    >
      <Descriptions bordered={false} items={items} />
    </div>
  );
}
