import styled from "styled-components";
import Flex from "components/flex";
const Wrapper = styled.div`
  padding: 10px 0;
`;

const BarWrapper = styled(Flex)``;

const Bar = styled.div`
  height: 4px;
  background: ${(p) =>
    p.value === true ? "#4caf50" : p.value === false ? "#f44336" : "#ebeef4"};
  flex-grow: 1;
  :not(:first-child) {
    margin-left: 4px;
  }
  :first-child {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  :last-child {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
`;

const DetailWrapper = styled(Flex)`
  min-height: 14px;
  margin-top: 8px;
  color: #506176;
  > :not(:first-child) {
    :nth-child(2) {
      margin-left: auto;
    }
    margin-left: 18px;
    display: flex;
    align-items: center;
    > img {
      width: 14px;
      height: 14px;
      margin-left: 8px;
    }
  }
`;

export default function Progress({ total, ayes, nays }) {
  const data = [];
  for (let i = 0; i < ayes; i++) data.push(true);
  for (let j = 0; j < nays; j++) data.push(false);
  for (let k = data.length; k < total; k++) data.push(undefined);

  return (
    <Wrapper>
      <BarWrapper>
        {data.map((item, index) => (
          <Bar key={index} value={item} />
        ))}
      </BarWrapper>
      <DetailWrapper>
        <div>{`${ayes}/${total}`}</div>
        <div>
          <div>{`Aye(${ayes})`}</div>
          <img src="/imgs/icons/approve.svg" alt="" />
        </div>
        <div>
          <div>{`Nay(${nays})`}</div>
          <img src="/imgs/icons/reject.svg" alt="" />
        </div>
      </DetailWrapper>
    </Wrapper>
  );
}
