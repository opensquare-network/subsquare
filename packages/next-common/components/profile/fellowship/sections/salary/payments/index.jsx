import DataList from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import { usePageProps } from "next-common/context/page";
import { useUrlSearchParams } from "next-common/hooks/useUrlSearchParams";
import nextApi from "next-common/services/nextApi";
import { fellowshipSalaryPaymentsApi } from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { useAsync, useUnmount } from "react-use";
import { useProfileFellowshipSalaryPaymentBeneficiaryColumn } from "./columns/beneficiary";
import { useProfileFellowshipSalaryPaymentCycleColumn } from "./columns/cycle";
import { useProfileFellowshipSalaryPaymentIsRegisteredColumn } from "./columns/isRegistered";
import { useProfileFellowshipSalaryPaymentPaidColumn } from "./columns/paid";
import { useProfileFellowshipSalaryPaymentRankColumn } from "./columns/rank";
import { useProfileFellowshipSalaryPaymentTimeAgeColumn } from "./columns/timeAge";

export default function ProfileFellowshipSalarySectionPayments({
  setPaymentsCount,
}) {
  const { id: address } = usePageProps();
  const [{ page }, , updateParams] = useUrlSearchParams();

  useUnmount(() => {
    updateParams({ page: 1 });
  });

  const cycleColumn = useProfileFellowshipSalaryPaymentCycleColumn();
  const rankColumn = useProfileFellowshipSalaryPaymentRankColumn();
  const beneficiaryColumn =
    useProfileFellowshipSalaryPaymentBeneficiaryColumn();
  const timeAgeColumn = useProfileFellowshipSalaryPaymentTimeAgeColumn();
  const isRegisteredColumn =
    useProfileFellowshipSalaryPaymentIsRegisteredColumn();
  const paidColumn = useProfileFellowshipSalaryPaymentPaidColumn();

  const columns = [
    cycleColumn,
    rankColumn,
    beneficiaryColumn,
    timeAgeColumn,
    isRegisteredColumn,
    paidColumn,
  ];

  const { value, loading } = useAsync(async () => {
    const resp = await nextApi.fetch(fellowshipSalaryPaymentsApi, {
      who: address,
      page,
      pageSize: defaultPageSize,
    });

    setPaymentsCount(resp?.result?.total);

    return resp?.result;
  }, [address, page]);

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
        shallow
      />
    </div>
  );
}
