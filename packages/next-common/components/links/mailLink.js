import { LinkEmail } from "@osn/icons/subsquare";
import IconLink from "./iconLink";

export default function MailLink({ email }) {
  return (
    <IconLink
      icon={<LinkEmail className="w-5 h-5" />}
      href={`mailto:${email}`}
    />
  );
}
