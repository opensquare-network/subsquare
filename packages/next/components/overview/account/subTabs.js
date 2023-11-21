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
    {
      label: "My Multisigs",
      render({ active }) {
        return (
          <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
            My Multisigs
          </Title>
        );
      },
      url: "/account/multisigs",
    },
  ];

  return <UrlTabs tabs={tabs} />;
}
