import { Title } from "components/myvotes/styled";
import UrlTabs from "next-common/components/urlTabs";
import { useChainSettings } from "next-common/context/chain";
import MultisigsTitle from "./multisigsTitle";

export function AccountSubTabs() {
  const { hasMultisig } = useChainSettings();

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

  if (hasMultisig) {
    tabs.push({
      label: "Multisigs",
      render({ active }) {
        return <MultisigsTitle active={active} />;
      },
      url: "/account/multisigs",
    });
  }

  return <UrlTabs tabs={tabs} />;
}
