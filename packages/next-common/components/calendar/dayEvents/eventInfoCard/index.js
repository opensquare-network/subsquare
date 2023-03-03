import styled from "styled-components";
import Divider from "../../../styled/layout/divider";
import Title from "./title";
import Content from "./content";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  gap: 8px;

  background: #ffffff;
  border: 1px solid #ebeef4;

  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
`;

function getDefaultTitle(event) {
  return "Untitled";
}

export default function EventInfoCard({ event }) {
  if (!event) {
    return null;
  }

  return (
    <Wrapper>
      <Title text={event?.data?.postTitle || getDefaultTitle(event)} />
      <Divider style={{ width: "100%" }} />
      <Content {...event} />
    </Wrapper>
  );
}
