import { Fragment } from "react";
import dynamic from "next/dynamic";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Tooltip from "next-common/components/tooltip";

const Statistics = dynamic(() => import("./statistics"), {
  ssr: false,
});

const CATEGORY_VALUES = {
  WALLET: "wallet",
  MULTISIG_TOOLS: "Multisig_Tools",
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
    <Fragment key={category.value}>
      <TitleContainer className="justify-start">
        <div className="flex gap-x-1">
          {category.label}
          <Tooltip content="The prices are calculated at awarded time."></Tooltip>
        </div>
      </TitleContainer>
      <Statistics category={category.value} />
    </Fragment>
  ));
}
