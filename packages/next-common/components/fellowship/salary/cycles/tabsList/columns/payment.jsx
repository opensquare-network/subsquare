import dayjs from "dayjs";
import Descriptions from "next-common/components/Descriptions";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn, toPrecision } from "next-common/utils";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";

const subColumns = [
  {
    name: "id",
    cellRender(data) {
      if (!data?.paymentId) {
        return null;
      }

      return data.paymentId;
    },
  },
  {
    name: "beneficiary",
    cellRender(data) {
      if (!data?.beneficiary) {
        return null;
      }

      return <BeneficiaryValue data={data} />;
    },
  },
  {
    name: "amount",
    cellRender(data) {
      if (!data?.amount) {
        return null;
      }

      return <AmountValue data={data} />;
    },
  },
  {
    name: "time",
    cellRender(data) {
      if (!data?.paidIndexer) {
        return null;
      }

      return <IndexerValue data={data} />;
    },
  },
];

export function useFellowshipSalaryCyclePaymentColumn() {
  return {
    name: "Payment",
    className: "min-w-[320px]",
    cellRender(data) {
      if (!data?.isPaid) {
        return <span className="text-textTertiary text14Medium">-</span>;
      }

      return <PaymentCell data={data} className="max-sm:hidden" />;
    },
  };
}

export function useFellowshipSalaryCyclePaymentMobileColumns() {
  const columns = subColumns.map((item) => {
    return {
      ...item,
      className: "sm:hidden",
      name: <span className="pl-4">{item.name}</span>,
    };
  });

  return columns;
}

function PaymentCell({ data, className = "" }) {
  const items = subColumns.map((item) => {
    return {
      label: item.name,
      value: item.cellRender(data),
    };
  });

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

function BeneficiaryValue({ data }) {
  return <AddressUser add={data?.beneficiary} showAvatar={false} />;
}

function AmountValue({ data }) {
  const { decimals, symbol } = getSalaryAsset();

  return (
    <ValueDisplay value={toPrecision(data?.amount, decimals)} symbol={symbol} />
  );
}

function IndexerValue({ data }) {
  return (
    <span className="text-textTertiary">
      {dayjs(data?.paidIndexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
    </span>
  );
}
