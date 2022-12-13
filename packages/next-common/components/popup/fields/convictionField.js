import React from "react";
import styled from "styled-components";
import PopupLabel from "next-common/components/popup/label";
import ConvictionSelect from "next-common/components/convictionSelect";
import useVoteLockTime from "next-common/utils/hooks/useVoteLockTime";
import Loading from "../../loading";
import FlexCenter from "../../styled/flexCenter";

const LockingPeriod = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #f6f7fa;
  border-radius: 4px;
  margin-top: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  .title {
    font-weight: 500;
    color: #1e2134;
  }
`;

export default function ConvictionField({
  conviction,
  setConviction,
  title = "Conviction",
  titleTooltip = "",
}) {
  const [time, isLoading] = useVoteLockTime(conviction);

  return (
    <div>
      <PopupLabel text={title} titleTooltip={titleTooltip} />
      <ConvictionSelect
        value={conviction}
        setValue={setConviction}
        disabled={false}
      />
      {isLoading && (
        <LockingPeriod>
          <FlexCenter>
            <Loading />
          </FlexCenter>
        </LockingPeriod>
      )}
      {!!time && (
        <LockingPeriod>
          <span className="title">Locking Period</span>
          <span>≈ {time}</span>
        </LockingPeriod>
      )}
    </div>
  );
}
