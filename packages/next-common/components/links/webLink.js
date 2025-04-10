import { LinkWebsite } from "@osn/icons/subsquare";
import IconLink from "./iconLink";
import { ensureProtocol } from "next-common/utils/url";

export default function WebLink({ website }) {
  return (
    <IconLink
      icon={<LinkWebsite className="w-5 h-5" />}
      href={ensureProtocol(website)}
    />
  );
}
