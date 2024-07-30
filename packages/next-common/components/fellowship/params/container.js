import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipParamsList from "next-common/components/fellowship/params/list";
import FellowshipParamsOffBoardTimeoutCard from "next-common/components/fellowship/params/off-boardTimeout";
import useRankFilter from "next-common/hooks/fellowship/useRankFilter";
import CollectiveParamsDescriptions from "./descriptions";

export default function FellowshipCoreParamsContainer({ params }) {
  const ranks = (params?.activeSalary || []).map((_, idx) => idx);
  const { rank, component } = useRankFilter(ranks, "-");

  return (
    <>
      <TitleContainer>
        <span>Params</span>
        {component}
      </TitleContainer>
      <div className="space-y-4 mt-4">
        <FellowshipParamsList rank={rank} params={params} />
        <FellowshipParamsOffBoardTimeoutCard />
        <CollectiveParamsDescriptions rank={rank} params={params} />
      </div>
    </>
  );
}
