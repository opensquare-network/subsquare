import React from "react";
import EditIcon from "../../../assets/imgs/icons/edit.svg";
import { emptyFunction } from "../../../utils";
import { LinkButton } from "./styled";

export default function PostEdit({ setIsEdit = emptyFunction }) {
  return (
    <LinkButton
      onClick={() => {
        setIsEdit(true);
      }}
    >
      <EditIcon />
      Edit
    </LinkButton>
  );
}
