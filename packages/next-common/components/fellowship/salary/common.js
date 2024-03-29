import ListLayout from "next-common/components/layout/ListLayout";

export default function FellowshipSalaryCommon({ children, ...props }) {
  const title = "Fellowship Salary";
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      tabs={[
        {
          label: "Cycles",
          url: "/fellowship/salary",
          exactMatch: true,
        },
        {
          label: "Feeds",
          url: "/fellowship/salary/feeds",
          exactMatch: true,
        },
      ].filter(Boolean)}
      {...props}
    >
      {children}
    </ListLayout>
  );
}
