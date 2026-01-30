import CardHeaderLayout from "../cardHeaderLayout";
import { LinkEmail } from "@osn/icons/subsquare";

export default function EmailCardHeader({ tag, actions }) {
  return (
    <CardHeaderLayout
      tag={tag}
      actions={actions}
      Icon={LinkEmail}
      title="Email"
    />
  );
}
