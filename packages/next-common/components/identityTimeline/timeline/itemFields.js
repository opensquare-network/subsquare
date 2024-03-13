import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;
  padding-top: 4px;
`;

const Title = styled.div`
  min-width: 176px;
  flex: 0 0 auto;
`;

const Body = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    padding-left: 0px;
  }
`;

export default function TimelineItemFields({ fields, className = "" }) {
  return (
    <Wrapper className={className}>
      {fields.map((field, index) => (
        <div key={index} className="flex max-sm:flex-col gap-[4px] my-[4px]">
          <Title className="text14Medium text-textTertiary">{field[0]}</Title>
          <Body className="text14Medium text-textPrimary">{field[1]}</Body>
        </div>
      ))}
    </Wrapper>
  );
}
