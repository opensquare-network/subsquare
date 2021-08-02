import styled from "styled-components";

const Wrapper = styled.div`
  padding: 10px 0;
`;

const BarWrapper = styled.div`
  display: flex;
  align-items: center;
`;

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
`;

const DetailWrapper = styled.div`
  display: flex;
  align-items: center;
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

export default function Progress({ data }) {
  const total = data.length;
  const [ayes, nays] = data.reduce(
    (pre, cur) => {
      if (cur === true) {
        pre[0]++;
      } else if (cur === false) {
        pre[1]++;
      }
      return pre;
    },
    [0, 0]
  );

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
          <img src="/imgs/icons/approve.svg" />
        </div>
        <div>
          <div>{`Nay(${nays})`}</div>
          <img src="/imgs/icons/reject.svg" />
        </div>
      </DetailWrapper>
    </Wrapper>
  );
}
