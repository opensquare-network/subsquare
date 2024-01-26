import ListLayout from "next-common/components/layout/ListLayout";

export default function FellowshipCoreCommon({ children, ...props }) {
  const title = "Fellowship Core";
  const desc =
    "The core pallet controls the overall process of induction, promotion and demotion according to the Fellowship rules and timelines, and handles the retention of evidence which members and candidates submit for these processes.";
  const seoInfo = { title, desc };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      tabs={[
        {
          label: "Members",
          url: "/fellowship/core",
          exactMatch: false,
        },
        { label: "Params", url: "/fellowship/core/params" },
      ].filter(Boolean)}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
