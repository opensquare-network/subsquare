import dynamic from "next/dynamic";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ProjectProvider, {
  PRICE_TYPE,
  usePriceType,
} from "./context/projectProvider";
import Select from "next-common/components/select";
import Tooltip from "next-common/components/tooltip";

const Statistics = dynamic(() => import("./statistics"), {
  ssr: false,
});

export default function TreasuryProjects() {
  return (
    <ProjectProvider>
      <ProjectStatisticsHeader />
      <Statistics />
    </ProjectProvider>
  );
}

function ProjectStatisticsHeader() {
  const { priceType, setPriceType } = usePriceType();
  const priceTypeOptions = [
    { value: PRICE_TYPE.FIAT_AT_SUBMISSION, label: "Fiat at Submission" },
    { value: PRICE_TYPE.FIAT_AT_FINAL, label: "Fiat at Final" },
  ];
  return (
    <div className="flex justify-between items-center mr-6">
      <TitleContainer className="justify-start">Wallet</TitleContainer>
      <div className="flex items-center gap-x-2">
        <div className="flex items-center gap-x-1">
          <span className="text12Medium text-textSecondary">Price Type:</span>
          <Tooltip content="The price type of the projects" />
        </div>
        <Select
          small
          className="w-[200px] text12Medium"
          value={priceType}
          options={priceTypeOptions}
          onChange={(item) => setPriceType(item.value)}
        />
      </div>
    </div>
  );
}
