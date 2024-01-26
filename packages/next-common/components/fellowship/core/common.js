import ListLayout from "next-common/components/layout/ListLayout";

export default function FellowshipCoreCommon({ children, ...props }) {
  const title = "Fellowship Core";
  const desc =
    "The core pallet controls the overall process of induction, promotion and demotion according to the Fellowship rules and timelines, and handles the retention of evidence which members and candidates submit for these processes.";
  const seoInfo = { title, desc };

  const corePath = "/fellowship/core";

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      tabs={[
        {
          label: "Members",
          url: corePath,
          urls: [corePath, "/fellowship/core/candidates"],
          exactMatch: true,
        },
        {
          label: "Params",
          url: "/fellowship/core/params",
          exactMatch: true,
        },
      ].filter(Boolean)}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
