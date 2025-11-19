import dynamic from "next/dynamic";
const Statistics = dynamic(() => import("./statistics"), {
  ssr: false,
});

const CATEGORY_VALUES = {
  WALLET: "wallet",
  MULTISIG_TOOLS: "multisig_tools",
};

const categories = [
  {
    label: "Wallet",
    value: CATEGORY_VALUES.WALLET,
  },
  {
    label: "Multisig Tools",
    value: CATEGORY_VALUES.MULTISIG_TOOLS,
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
