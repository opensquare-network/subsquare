import ListLayout from "next-common/components/layout/ListLayout";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function DelegationLayout({ children }) {
  const realAddress = useRealAddress();
  const title = "Delegation";
  const desc = "No time to vote? Delegate your votes to an expert.";
  const seoInfo = { title, desc };

  const tabs = [
    {
      label: "Delegates",
      url: "/delegation",
      exactMatch: true,
    },
    {
      label: "Delegation Stats",
      url: "/delegation/stats",
      exactMatch: true,
    },
  ];

  if (realAddress) {
    tabs.push({
      label: "My Delegation",
      url: "/delegation/mine",
      exactMatch: false,
    });
  }

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={title}
      description={seoInfo.desc}
      tabs={tabs}
    >
      {children}
    </ListLayout>
  );
}
