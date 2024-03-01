import FellowshipRank from "next-common/components/fellowship/rank";
import { AddressUser } from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import { fellowshipSalaryCycleRegistrationsApi } from "next-common/services/url";
import { toPrecision } from "next-common/utils";
import { useRouter } from "next/router";
import FellowshipSalaryCycleTabRegistrationPaymentCell from "./registrationsPaymentCell";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";

export function useFellowshipSalaryCycleRegistrationsTabItem() {
  const { registrations } = usePageProps();
  const { query } = useRouter();
  const { id } = query;
  const { decimals, symbol } = useSalaryAsset();

  return {
    name: "Registrations",
    activeCount: registrations?.total ?? 0,
    columns: [
      {
        name: "Rank",
        width: 80,
        cellRender(data) {
          return <FellowshipRank rank={data.memberInfo.rank} />;
        },
      },
      {
        name: "Member",
        width: 240,
        cellRender(data) {
          return <AddressUser add={data.who} />;
        },
      },
      {
        name: "Salary",
        width: 160,
        cellRender(data) {
          return (
            <ValueDisplay
              value={toPrecision(data.salary, decimals)}
              symbol={symbol}
            />
          );
        },
      },
      {
        name: "Payment",
        minWidth: 240,
        className: "min-w-[320px]",
        cellRender(data) {
          return (
            <FellowshipSalaryCycleTabRegistrationPaymentCell data={data} />
          );
        },
      },
    ],
    api: {
      path: fellowshipSalaryCycleRegistrationsApi(id),
      initData: registrations,
    },
  };
}
