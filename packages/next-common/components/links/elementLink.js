import { LinkElement } from "@osn/icons/subsquare";
import IconLink from "./iconLink";

export default function ElementLink({ riot }) {
  return (
    <IconLink icon={<LinkElement />} href={`https://matrix.to/#/${riot}`} />
  );
}
