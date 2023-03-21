import React from "react";
import noop from "lodash.noop";
import LinkIcon from "../../../assets/imgs/icons/link.svg";
import { LinkButton } from "./styled";

export default function PostLink({ onClick = noop }) {
  return (
    <LinkButton onClick={onClick}>
      <LinkIcon />
      Link
    </LinkButton>
  );
}
