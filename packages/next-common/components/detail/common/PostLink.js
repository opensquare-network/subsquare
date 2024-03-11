import React from "react";
import { noop } from "lodash-es";
import { LinkButton } from "./styled";
import { SystemLink } from "@osn/icons/subsquare";

export default function PostLink({ onClick = noop }) {
  return (
    <LinkButton onClick={onClick}>
      <SystemLink className="w-5 h-5 [&_path]:fill-textSecondary" />
      Link
    </LinkButton>
  );
}
