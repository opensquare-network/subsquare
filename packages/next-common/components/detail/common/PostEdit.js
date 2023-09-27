import React from "react";
import { emptyFunction } from "../../../utils";
import { LinkButton } from "./styled";
import { SystemEdit } from "@osn/icons/subsquare";

export default function PostEdit({ setIsEdit = emptyFunction }) {
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
