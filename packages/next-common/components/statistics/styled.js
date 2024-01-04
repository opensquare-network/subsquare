import styled from "styled-components";
import tw from "tailwind-styled-components";

export const OriginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;

  background: var(--neutral100);
  border: 1px solid var(--neutral300);
  box-shadow:
    0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 8px;

  margin-top: 16px;
`;
export const Wrapper = tw(OriginWrapper)`
max-sm:!rounded-none
`;

export const Header = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;

  color: var(--textPrimary);
`;

export const StatisticsTitle = tw.h4`
text14Bold
text-textPrimary
mb-6
`;
