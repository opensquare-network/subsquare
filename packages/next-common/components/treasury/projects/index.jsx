import dynamic from "next/dynamic";
const Statistics = dynamic(() => import("./statistics"), {
  ssr: false,
});

const CATEGORY_VALUES = {
  WALLET: "wallet",
  MULTISIG_TOOLS: "multisig_tools",
  EXPLORER: "explorer",
};

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
];

export default function TreasuryProjects() {
  return categories.map((category) => (
    <Statistics
      key={category.value}
      label={category.label}
      category={category.value}
    />
  ));
}
