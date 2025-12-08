import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import SchedulerTable from "next-common/components/pages/components/scheduler/table";
import { fetchScanHeight } from "next-common/services/fetchScanHeight";

export default function SchedulerPage() {
  const seoInfo = {
    title: "Scheduler",
    desc: "The scheduler is a list of all the scheduled calls in the system.",
  };
  return (
    <ListLayout
      seoInfo={seoInfo}
      title={seoInfo.title}
      description={seoInfo.desc}
    >
      <SchedulerTable />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const scanHeight = await fetchScanHeight();

  return {
    props: {
      scanHeight: scanHeight ?? null,
    },
  };
});
