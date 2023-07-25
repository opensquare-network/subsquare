import { LinkTwitter } from "@osn/icons/subsquare";
import IconLink from "./iconLink";

export default function TwitterLink({ twitter }) {
  return (
    <IconLink
      icon={<LinkTwitter />}
      href={`https://www.twitter.com/${twitter}`}
    />
  );
}
