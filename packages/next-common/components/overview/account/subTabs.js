import UrlTabs from "next-common/components/urlTabs";
import { useChain, useChainSettings } from "next-common/context/chain";
import MultisigsTitle from "./multisigsTitle";
import { Title } from "./styled";
import { isKintsugiChain } from "next-common/utils/chain";
import DepositsTitle from "./depositsTitle";
import Chains from "next-common/utils/consts/chains";

function TabTitle({ active, children }) {
  return (
    <Title className={active ? "text-textPrimary" : "text-textTertiary"}>
      {children}
    </Title>
  );
}

export default function AccountSubTabs({ className = "" }) {
  const {
    hasMultisig,
    modules: { proxy },
  } = useChainSettings();
  const chain = useChain();

  const tabs = [];
  if (
    !isKintsugiChain(chain) &&
    ![Chains.collectives, Chains.westendCollectives].includes(chain)
  ) {
    tabs.push({
      label: "Votes",
      render: ({ active }) => <TabTitle active={active}>Votes</TabTitle>,
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

  if (
    !isKintsugiChain(chain) &&
    ![Chains.collectives, Chains.westendCollectives].includes(chain)
  ) {
    tabs.push({
      label: "Delegated Votes",
      render: ({ active }) => (
        <TabTitle active={active}>Delegated Votes</TabTitle>
      ),
      url: "/account/delegations",
    });

    tabs.push({
      label: "Been Delegated",
      render: ({ active }) => (
        <TabTitle active={active}>Been Delegated</TabTitle>
      ),
      url: "/account/been-delegated",
    });

    if (proxy) {
      tabs.push({
        label: "Proxies",
        render: ({ active }) => <TabTitle active={active}>Proxies</TabTitle>,
        url: "/account/proxies",
      });
    }
  }

  return <UrlTabs tabs={tabs} className={className} />;
}
