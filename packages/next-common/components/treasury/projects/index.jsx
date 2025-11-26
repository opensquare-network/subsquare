import dynamic from "next/dynamic";
import { CATEGORY_VALUES } from "./const";
const Statistics = dynamic(() => import("./statistics"), {
  ssr: false,
});

const categories = [
  {
    label: "Wallets",
    value: CATEGORY_VALUES.WALLET,
  },
  {
    label: "Multisig Tools",
    value: CATEGORY_VALUES.MULTISIG_TOOLS,
  },
  {
    label: "Explorers",
    value: CATEGORY_VALUES.EXPLORER,
  },
  {
    label: "Governance Platforms",
    value: CATEGORY_VALUES.GOVERNANCE_PLATFORM,
  },
  {
    label: "Polkadot Clients",
    value: CATEGORY_VALUES.POLKADOT_CLIENT,
  },
];

export default function TreasuryProjects() {
  return (
    <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
      {categories.map((category) => (
        <Statistics
          key={category.value}
          label={category.label}
          category={category.value}
        />
      ))}
    </div>
  );
}
