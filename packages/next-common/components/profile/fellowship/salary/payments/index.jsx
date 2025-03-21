import DataList from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import { usePageProps } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import {
  ambassadorSalaryPaymentsApi,
  fellowshipSalaryPaymentsApi,
} from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { useRouter } from "next/router";
import { useAsync } from "react-use";
import { useProfileFellowshipSalaryPaymentBeneficiaryColumn } from "./columns/beneficiary";
import { useProfileFellowshipSalaryPaymentCycleColumn } from "./columns/cycle";
import { useProfileFellowshipSalaryPaymentRegistrationColumn } from "./columns/Registration";
import { useProfileFellowshipSalaryPaymentPaidColumn } from "./columns/paid";
import { useProfileFellowshipSalaryPaymentRankColumn } from "./columns/rank";
import { useProfileFellowshipSalaryPaymentTimeAgeColumn } from "./columns/timeAge";
import { useState } from "react";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export function FellowshipSalaryPayments({ setPaymentsCount, columns }) {
  const { id: address } = usePageProps();
  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page || 1));

  let paymentsApi;
  const { section } = useCollectivesContext();
  if (section === "fellowship") {
    paymentsApi = fellowshipSalaryPaymentsApi;
  } else if (section === "ambassador") {
    paymentsApi = ambassadorSalaryPaymentsApi;
  }

  const { value, loading } = useAsync(async () => {
    if (!paymentsApi) {
      return;
    }

    const resp = await nextApi.fetch(paymentsApi, {
      who: address,
      page,
      pageSize: defaultPageSize,
    });

    setPaymentsCount(resp?.result?.total);

    return resp?.result;
  }, [address, page, paymentsApi]);

  const rows = value?.items?.map?.((item, idx) => {
    return columns.map((col) => {
      return col.cellRender(item, idx);
    });
  });

  return (
    <div>
      <DataList
        noDataText="No data"
        loading={loading}
        columns={columns}
        rows={rows}
      />

      <Pagination
        page={page}
        pageSize={value?.pageSize}
        total={value?.total}
        onPageChange={(_, page) => {
          setPage(page);
        }}
        shallow
      />
    </div>
  );
}

export default function ProfileFellowshipSalaryPayments({ setPaymentsCount }) {
  const cycleColumn = useProfileFellowshipSalaryPaymentCycleColumn();
  const rankColumn = useProfileFellowshipSalaryPaymentRankColumn();
  const beneficiaryColumn =
    useProfileFellowshipSalaryPaymentBeneficiaryColumn();
  const timeAgeColumn = useProfileFellowshipSalaryPaymentTimeAgeColumn();
  const registrationColumn =
    useProfileFellowshipSalaryPaymentRegistrationColumn();
  const paidColumn = useProfileFellowshipSalaryPaymentPaidColumn();

  const columns = [
    cycleColumn,
    rankColumn,
    beneficiaryColumn,
    timeAgeColumn,
    registrationColumn,
    paidColumn,
  ];

  return (
    <FellowshipSalaryPayments
      setPaymentsCount={setPaymentsCount}
      columns={columns}
    />
  );
}
