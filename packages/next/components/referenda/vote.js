import styled from "styled-components";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
  margin: 16px 0;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Headers = styled(Flex)`
  justify-content: space-between;
  font-size: 12px;
  color: #506176;
`;

const Contents = styled(Headers)`
  font-weight: 500;
  color: #1e2134;
  margin-bottom: 16px;
`;

const Button = styled.button`
  width: 100%;
  height: 38px;
  border-width: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: default;
`;

const PassButton = styled(Button)`
  color: #4caf50;
  background: #edf7ed;
`;

const RejectButton = styled(Button)`
  color: #f44336;
  background: #fff1f0;
`;

const Row = styled(Flex)`
  height: 48px;
  margin-bottom: 16px;
`;

const BorderedRow = styled(Flex)`
  height: 48px;
  border-bottom: 1px solid #ebeef4;
`;

const Header = styled.span`
  width: 120px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #1e2134;

  svg {
    margin-right: 4px;
  }
`;

function Vote({ referendum }) {
  return (
    <Wrapper>
      <Title>Votes</Title>
      <svg
        width="751"
        height="24"
        viewBox="0 0 751 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="729"
          height="8"
          transform="translate(0 8)"
          fill="#4CAF50"
        />
        <rect
          width="18"
          height="8"
          transform="translate(733 8)"
          fill="#F44336"
        />
      </svg>

      <Headers>
        <span>Aye</span>
        <span>Passing threshold</span>
        <span>Nay</span>
      </Headers>

      <Contents>
        <span>1,000.00</span>
        <span>2,000,000.00</span>
        <span>10.00</span>
      </Contents>

      <BorderedRow>
        <Header>Turnout</Header>
        <span>4,232 KSM</span>
      </BorderedRow>

      <BorderedRow>
        <Header>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.4933 3.1543L5.16868 10.8452L1.50635 6.99991"
              stroke="#4CAF50"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Aye
        </Header>
        <span>4000 KSM</span>
      </BorderedRow>

      <Row>
        <Header>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.50439 2.50391L7.00023 6.99975M7.00023 6.99975L11.4961 11.4956M7.00023 6.99975L11.4961 2.50391M7.00023 6.99975L2.50439 11.4956"
              stroke="#F44336"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Nay
        </Header>
        <span>232 KSM</span>
      </Row>
      {referendum?.info?.finished?.approved && <PassButton>Passed</PassButton>}
      {referendum?.info?.finished?.approved === false && (
        <RejectButton>Rejected</RejectButton>
      )}
    </Wrapper>
  );
}

export default Vote;
