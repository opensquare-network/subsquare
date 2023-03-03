import { democracyReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import { ItemWrapper } from "./infoItem/styled";

export default function DemocracyReferendumExecutedContent({
  referendumIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={referendumIndex} baseUrl={democracyReferendumBaseUrl} />
      <ItemWrapper>
        <span>Success:</span>
        <span>{data?.isOk ? "Yes" : "No"}</span>
      </ItemWrapper>
    </>
  );
}
