import { fellowshipBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import { ItemWrapper } from "./infoItem/styled";

export default function FellowshipContent({ index, data }) {
  return (
    <>
      <IndexItem index={index} baseUrl={fellowshipBaseUrl} />
      <ProposerItem proposer={data.proposer} />
      <ItemWrapper>
        <span>Track:</span>
        <span>{data?.track}</span>
      </ItemWrapper>
    </>
  );
}
