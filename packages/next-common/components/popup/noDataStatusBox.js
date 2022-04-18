import styled from "styled-components";

const StatusWrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
  > div.value {
    font-size: 14px;
    line-height: 100%;
    font-weight: 500;
    > span {
      color: #9da9bb;
      margin-left: 2px;
    }
  }
  > div.result {
    display: flex;
    align-items: center;
    color: #506176;
    > svg {
      margin-left: 8px;
    }
  }
  > img {
    margin: 0 auto;
  }
  > div.no-data {
    font-size: 14px;
    line-height: 100%;
    color: #9da9bb;
    flex-grow: 1;
    text-align: center;
  }
`;

export default function NoDataStatusBox({ text }) {
  return (
    <StatusWrapper>
      <div className="no-data">{text}</div>
    </StatusWrapper>
  );
}
