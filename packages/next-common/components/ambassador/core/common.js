import useFetchAmbassadorCoreMembers from "next-common/hooks/ambassador/core/useFetchAmbassadorCoreMembers";
import ListLayout from "next-common/components/layout/ListLayout";
import AmbassadorCoreMembersSummary from "next-common/components/ambassador/core/members/summary";

export default function AmbassadorCoreCommon({ children, ...props }) {
  const title = "Ambassador Core";
  const desc =
    "The core pallet controls the overall process of induction, promotion and demotion according to the ambassador rules and timelines, and handles the retention of evidence which members and candidates submit for these processes.";
  const seoInfo = { title, desc };
  useFetchAmbassadorCoreMembers();

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      summary={<AmbassadorCoreMembersSummary />}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
