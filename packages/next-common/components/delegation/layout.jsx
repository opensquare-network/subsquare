import ListLayout from "next-common/components/layout/ListLayout";

export default function DelegationLayout({ children }) {
  const title = "Delegation";
  const desc = "No time to vote? Delegate your votes to an expert.";
  const seoInfo = { title, desc };

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      tabs={[
        {
          label: "Delegates",
          url: "/delegation",
          exactMatch: true,
        },
        {
          label: "My Delegation",
          url: "/delegation/my-delegation",
        },
      ]}
    >
      {children}
    </ListLayout>
  );
}
