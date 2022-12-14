import React from "react";
import styled from "styled-components";
import PopupLabel from "next-common/components/popup/label";
import ConvictionSelect from "next-common/components/convictionSelect";
import useVoteLockTime from "next-common/utils/hooks/useVoteLockTime";
import Loading from "../../loading";
import { StatusWrapper } from "../styled";

const LockingPeriod = styled(StatusWrapper)`
  margin-top: 8px;
`;

export default function ConvictionField({
  conviction,
  setConviction,
  title = "Conviction",
  titleTooltip = "",
  module,
}) {
  const [time, isLoading] = useVoteLockTime(conviction, module);

  let lockingPeriod = null;

  if (isLoading) {
    lockingPeriod = (
      <LockingPeriod>
        <div className="no-data">
          <Loading />
        </div>
      </LockingPeriod>
    );
  } else if (time) {
    lockingPeriod = (
      <LockingPeriod>
        <div className="value">Locking Period</div>
        <div className="result">≈ {time}</div>
      </LockingPeriod>
    );
  }

  return (
    <div>
      <PopupLabel text={title} titleTooltip={titleTooltip} />
      <ConvictionSelect
        value={conviction}
        setValue={setConviction}
        disabled={false}
      />
      {lockingPeriod}
    </div>
  );
}
