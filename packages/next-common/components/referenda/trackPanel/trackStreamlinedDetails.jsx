import React, { memo } from "react";
import useTrackDetail from "next-common/components/summary/newProposalPopup/useTrackDetail";
import { startCase } from "lodash-es";
import { Wrapper, LineBox, LineTitle, LineValue, Divider } from "./lineItem.js";

function TrackStreamlinedDetails({ trackId }) {
  const { id, name, description } = useTrackDetail(trackId);

  return (
    <Wrapper className="max-w-[320px]">
      <p className="text16Bold text-textPrimary leading-6">{`[${
        id ?? "-"
      }] Origin: ${startCase(name) ?? "-"}`}</p>
      <p className="text14Medium text-textSecondary">{description ?? "-"}</p>
      <Divider className="my-3" />
      <LineBox>
        <LineTitle title="Capacity" />
        <LineValue>
          <span> 1</span>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Confirm Period" />
        <LineValue>
          <span> 2</span>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Prepare Period" />
        <LineValue>
          <span> 3</span>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Decision Period" />
        <LineValue>
          <span> 4</span>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Min Enact Period" />
        <LineValue>
          <span> 5</span>
        </LineValue>
      </LineBox>
      <LineBox>
        <LineTitle title="Decision Deposit" />
        <LineValue>
          <span> 6</span>
        </LineValue>
      </LineBox>
    </Wrapper>
  );
}

export default memo(TrackStreamlinedDetails);
