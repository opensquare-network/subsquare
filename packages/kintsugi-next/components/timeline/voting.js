import styled from "styled-components";
import User from "components/user";
import Progress from "./progress";
import Flex from "../styled/flex";

const TitleWrapper = styled(Flex)`
  justify-content: space-between;
  min-height: 28px;
  > :last-child {
    display: flex;
    align-items: center;
    color: #506176;
    > img {
      margin-left: 4px;
    }
  }
`;

export default function Voting({ data, chain }) {
  return (
    <div>
      <TitleWrapper>
        <User chain={chain} add={data.proposer} fontSize={12} />
        <div>
          <div>{data.method}</div>
          <img src="/imgs/icons/approve.svg" alt="" />
        </div>
      </TitleWrapper>
      <Progress total={data.total} ayes={data.ayes} nays={data.nays} />
    </div>
  );
}
