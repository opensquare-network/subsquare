import React from "react";
import { getGov2ReferendumStateArgs } from "../../../../utils/gov2/result";
import { useOnchainData, usePostState } from "../../../../context/post";
import { Gov2ReferendaTag } from "../../../tags/state/gov2";

export default function ReferendaState() {
  const onchain = useOnchainData();
  const state = usePostState();
  const args = getGov2ReferendumStateArgs(onchain.state);

  return <Gov2ReferendaTag state={state} args={args} />;
}
