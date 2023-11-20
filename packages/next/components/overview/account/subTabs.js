import { Title } from "components/myvotes/styled";
import UrlTabs from "next-common/components/urlTabs";

export function AccountSubTabs() {
  const tabs = [
    {
      label: "Votes",
      render({ active }) {
        return (
          <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
            Votes
          </Title>
        );
      },
      url: "/account/votes",
    },
  ];

  return <UrlTabs className="ml-6" tabs={tabs} />;
}
