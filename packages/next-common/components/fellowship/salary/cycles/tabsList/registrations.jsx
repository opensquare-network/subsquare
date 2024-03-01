import { usePageProps } from "next-common/context/page";
import { fellowshipSalaryCycleRegistrationsApi } from "next-common/services/url";

export function useFellowshipSalaryCycleRegistrationsTabItem() {
  const { registrations } = usePageProps();
  const { id } = usePageProps();

  return {
    name: "Registrations",
    url: `/fellowship/salary/cycles/${id}`,
    activeCount: registrations?.total ?? 0,
    columns: [
      {
        name: "Rank",
        cellRender(data) {
          return <div>{data.memberInfo.rank}</div>;
        },
      },
    ],
    api: {
      path: fellowshipSalaryCycleRegistrationsApi(id),
      initData: registrations,
    },
  };
}
