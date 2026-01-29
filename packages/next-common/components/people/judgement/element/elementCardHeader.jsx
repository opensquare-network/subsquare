import CardHeaderLayout from "../cardHeaderLayout";
import { LinkElement } from "@osn/icons/subsquare";

export default function ElementCardHeader({ tag, actions }) {
  return (
    <CardHeaderLayout
      tag={tag}
      actions={actions}
      Icon={LinkElement}
      title="Element"
    />
  );
}
