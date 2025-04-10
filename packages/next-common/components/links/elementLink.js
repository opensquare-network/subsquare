import { LinkElement } from "@osn/icons/subsquare";
import IconLink from "./iconLink";

export default function ElementLink({ riot }) {
  return (
    <IconLink
      icon={<LinkElement className="w-5 h-5" />}
      href={`https://matrix.to/#/${riot}`}
    />
  );
}
