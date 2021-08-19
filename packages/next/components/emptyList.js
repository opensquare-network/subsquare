import styled from "styled-components";

const Wrapper = styled.div`
display: flex;
align-items: center;
justify-content: center;
height: 143px;
background: #ffffff;
border: 1px solid #ebeef4;
box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
  0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
  0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
border-radius: 6px;
padding: 24px;

font-style: normal;
font-weight: normal;
font-size: 14px;
text-align: center;
color: #9DA9BB;
`;

export default function EmptyList() {
  return (
    <Wrapper>
      <span>No current discussions</span>
    </Wrapper>
  );
}
