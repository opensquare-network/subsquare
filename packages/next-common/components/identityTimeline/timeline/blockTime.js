import styled from "styled-components";
import InfoTime from "@osn/icons/subsquare/InfoTime";
import dayjs from "dayjs";
import Duration from "next-common/components/duration";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  > :nth-child(1) {
    margin-right: 4px;
  }
  > :nth-child(2) {
    margin-right: 8px;
  }
`;

const ClockIcon = styled(InfoTime)`
  width: 16px;
  height: 16px;
  path {
    fill: ${(p) => p.theme.textTertiary};
  }
`;

export default function BlockTime({ ts }) {
  return (
    <Wrapper className="text12Medium whitespace-nowrap">
      <ClockIcon />
      <div className="text-textTertiary">
        {dayjs(ts).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <div className="text-textDisabled">
        <Duration time={ts} />
      </div>
    </Wrapper>
  );
}
