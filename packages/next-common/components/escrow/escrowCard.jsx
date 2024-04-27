import { cn } from "next-common/utils";
import Loading from "next-common/components/loading";
import LineChart from "./lineChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled from "styled-components";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;
  justify-content: flex-start;
`;

export default function PriceCardContent({
  title,
  data = {},
  loading,
  titleSymbol,
}) {
  return (
    <SecondaryCard>
      <Title>
        {title}
        {titleSymbol && (
          <span className="text14Bold text-textTertiary ml-1">
            {titleSymbol}
          </span>
        )}
      </Title>

      <div className={cn("relative", "mt-2")}>
        {loading ? (
          <div className={cn("h-[144px]", "flex items-center justify-center")}>
            <Loading size={24} />
          </div>
        ) : (
          <LineChart className="h-[150px]" data={data} />
        )}
      </div>
    </SecondaryCard>
  );
}
