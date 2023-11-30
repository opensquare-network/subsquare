import UrlTabs from "next-common/components/urlTabs";
import { useChain, useChainSettings } from "next-common/context/chain";
import MultisigsTitle from "./multisigsTitle";
import { Title } from "./styled";
import { isKintsugiChain } from "next-common/utils/chain";
import DepositsTitle from "./depositsTitle";

export default function AccountSubTabs() {
  const { hasMultisig } = useChainSettings();
  const chain = useChain();

  const tabs = [];
  if (!isKintsugiChain(chain)) {
    tabs.push({
      label: "Votes",
      render({ active }) {
        return (
          <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
            Votes
          </Title>
        );
      },
      url: "/account/votes",
    });
  }

  tabs.push({
    label: "Deposits",
    render({ active }) {
      return <DepositsTitle active={active} />;
    },
    url: "/account/deposits",
  });

  if (hasMultisig) {
    tabs.push({
      label: "Multisigs",
      render({ active }) {
        return <MultisigsTitle active={active} />;
      },
      url: "/account/multisigs",
    });
  }

  return <UrlTabs className="ml-6" tabs={tabs} />;
}
