import { useChain, useChainSettings } from "next-common/context/chain";
import MultisigsTitle from "./multisigsTitle";
import { Title } from "./styled";
import { isKintsugiChain } from "next-common/utils/chain";
import DepositsTitle from "./depositsTitle";
import ProxiesTitle from "./proxiesTitle";
import Chains from "next-common/utils/consts/chains";
import TabsList from "next-common/components/tabs/list";

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
      value: "votes",
      label: ({ active }) => <TabTitle active={active}>Votes</TabTitle>,
      url: "/account/votes",
    });
  }

  tabs.push({
    value: "deposits",
    label({ active }) {
      return <DepositsTitle active={active} />;
    },
    url: "/account/deposits",
  });

  if (hasMultisig) {
    tabs.push({
      value: "multisigs",
      label({ active }) {
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
      value: "delegated_votes",
      label: ({ active }) => (
        <TabTitle active={active}>Delegated Votes</TabTitle>
      ),
      url: "/account/delegations",
    });

    tabs.push({
      value: "been_delegated",
      label: ({ active }) => (
        <TabTitle active={active}>Been Delegated</TabTitle>
      ),
      url: "/account/been-delegated",
    });
  }

  if (proxy) {
    tabs.push({
      value: "proxies",
      label: ({ active }) => <ProxiesTitle active={active} />,
      url: "/account/proxies",
    });
  }

  return <TabsList tabs={tabs} className={className} />;
}
