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
