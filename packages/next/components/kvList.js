import styled from "styled-components";
import Links from "./timeline/links";
import User from "./user";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
  0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
  0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 600px) {
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

const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: start;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #EBEEF4;
  background-color: white;
`
const Header = styled.div`
  width: 128px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  flex: none;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #1E2134;
  word-break: break-all;
`


function KVList({data, title, chain}) {
  if (!data) {
    return null;
  }
  return (
    <Wrapper>
      <Title>{title}</Title>
      {
        data.map(row => (
          <Row>
            {
              row.length === 1 && row[0]
            }
            {
              row.length === 2 &&
              <>
                <Header>
                  {row[0]}
                </Header>
                <Content>
                  {row[1]}
                </Content>
              </>
            }
          </Row>
        ))
      }
    </Wrapper>
  )
}

export default KVList;
