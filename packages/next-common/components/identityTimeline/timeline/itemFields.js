import tw from "tailwind-styled-components";

const Wrapper = tw.div`
  flex
  flex-col
  justify-start
  grow
  pt-[4px]
`;

const Title = tw.div`
  min-w-[176px]
  grow-0
  shrink-0
  basis-auto
  text14Medium
  text-textTertiary
`;

const Body = tw.div`
  flex
  items-center
  grow
  text14Medium
  text-textPrimary
`;

export default function TimelineItemFields({ fields, className = "" }) {
  return (
    <Wrapper className={className}>
      {fields.map((field, index) => (
        <div key={index} className="flex max-sm:flex-col gap-[4px] my-[4px]">
          <Title>{field[0]}</Title>
          <Body>{field[1]}</Body>
        </div>
      ))}
    </Wrapper>
  );
}
