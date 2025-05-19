import { LinkTwitter } from "@osn/icons/subsquare";
import IconLink from "./iconLink";

export default function TwitterLink({ twitter }) {
  return (
    <IconLink
      icon={<LinkTwitter className="w-5 h-5" />}
      href={`https://www.twitter.com/${twitter}`}
    />
  );
}
