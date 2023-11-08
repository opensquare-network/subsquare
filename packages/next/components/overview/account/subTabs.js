import { Title } from "components/myvotes/styled";
import UrlTabs from "next-common/components/urlTabs";

export function AccountSubTabs() {
  const tabs = [
    {
      label: "My Votes",
      render({ active }) {
        return (
          <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
            My Votes
          </Title>
        );
      },
      url: "/votes",
    },
  ];

  return <UrlTabs tabs={tabs} />;
}
