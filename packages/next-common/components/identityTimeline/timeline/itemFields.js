import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;
  padding-top: 2px;
  padding-bottom: 16px;
`;

const Title = styled.div`
  padding: 8px 0;
  min-width: 176px;
  flex: 0 0 auto;
`;

const Body = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 8px 0 8px 24px;
  @media screen and (max-width: 900px) {
    padding-left: 0px;
  }
`;

export default function TimelineItemFields({ fields, className = "" }) {
  return (
    <Wrapper className={className}>
      {fields.map((field, index) => (
        <div key={index} className="flex max-sm:flex-col">
          <Title className="text14Medium text-textTertiary">{field[0]}</Title>
          <Body className="text14Medium text-textPrimary">{field[1]}</Body>
        </div>
      ))}
    </Wrapper>
  );
}
