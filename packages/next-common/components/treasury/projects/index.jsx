import dynamic from "next/dynamic";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Tooltip from "next-common/components/tooltip";

const Statistics = dynamic(() => import("./statistics"), {
  ssr: false,
});

export default function TreasuryProjects() {
  return (
    <>
      <TitleContainer className="justify-start">
        <div className="flex gap-x-1">
          Wallet
          <Tooltip content="The prices are calculated at awarded time."></Tooltip>
        </div>
      </TitleContainer>
      <Statistics />
    </>
  );
}
