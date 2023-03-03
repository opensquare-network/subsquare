import { referendaReferendumBaseUrl } from "../../../../utils/postBaseUrl";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import { ItemWrapper } from "./infoItem/styled";

export default function referendaReferendumContent({ index, data }) {
  return (
    <>
      <IndexItem index={index} baseUrl={referendaReferendumBaseUrl} />
      <ProposerItem proposer={data.proposer} />
      <ItemWrapper>
        <span>Track:</span>
        <span>{data?.track}</span>
      </ItemWrapper>
    </>
  );
}
