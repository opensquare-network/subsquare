import DetailLayout from "next-common/components/layout/DetailLayout";

export default function FellowshipSalaryCyclesLayout({ children, ...props }) {
  const title = "Fellowship Salary Cycle";
  const desc =
    "The salary pallet controls the periodic process of salary payments and members registration.";
  const seoInfo = { title, desc };

  return (
    <DetailLayout
      title={title}
      description={desc}
      seoInfo={seoInfo}
      wrapChildrenWithPanel={false}
      {...props}
    >
      {children}
    </DetailLayout>
  );
}
