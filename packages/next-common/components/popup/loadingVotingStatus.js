import React from "react";

import { StatusWrapper } from "./styled";
import Loading from "../loading";
import Flex from "../styled/flex";

export default function LoadingVotingStatus() {
  return (
    <StatusWrapper>
      <Flex>
        <Loading size={14} />
      </Flex>
    </StatusWrapper>
  )
}
