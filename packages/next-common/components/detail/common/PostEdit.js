import React from "react";
import { LinkButton } from "./styled";
import { SystemEdit } from "@osn/icons/subsquare";
import { noop } from "lodash-es";

export default function PostEdit({ setIsEdit = noop }) {
  return (
    <LinkButton
      onClick={() => {
        setIsEdit(true);
      }}
    >
      <SystemEdit className="w-5 h-5 [&_path]:fill-textSecondary" />
      Edit
    </LinkButton>
  );
}
