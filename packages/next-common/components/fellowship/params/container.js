import { useState } from "react";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Select from "next-common/components/select";
import FellowshipParamsList from "next-common/components/fellowship/params/list";
import FellowshipParamsOffBoardTimeoutCard from "next-common/components/fellowship/params/off-boardTimeout";

export default function FellowshipCoreParamsContainer({ params }) {
  const options = [
    {
      label: "-",
      value: "",
    },
    ...(params?.activeSalary || []).map((_, idx) => {
      return {
        label: idx + 1,
        value: idx,
      };
    }),
  ];
  const [rank, setRank] = useState(options[0].value);

  return (
    <>
      <TitleContainer>
        <span>Params</span>
        <div className="text12Medium text-textPrimary flex items-center gap-x-2">
          <div>Rank</div>
          <Select
            className="w-20"
            small
            value={rank}
            options={options}
            onChange={(option) => {
              setRank(option.value);
            }}
          />
        </div>
      </TitleContainer>
      <div className="space-y-4 mt-4">
        <FellowshipParamsList rank={rank} params={params} />
        <FellowshipParamsOffBoardTimeoutCard />
      </div>
    </>
  );
}
