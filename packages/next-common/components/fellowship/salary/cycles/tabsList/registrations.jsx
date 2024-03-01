import { usePageProps } from "next-common/context/page";
import { fellowshipSalaryCycleRegistrationsApi } from "next-common/services/url";
import { useRouter } from "next/router";

export function useFellowshipSalaryCycleRegistrationsTabItem() {
  const { registrations } = usePageProps();
  const { query } = useRouter();
  const { id } = query;

  return {
    name: "Registrations",
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
