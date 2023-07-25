import { LinkEmail } from "@osn/icons/subsquare";
import IconLink from "./iconLink";

export default function MailLink({ email }) {
  return <IconLink icon={<LinkEmail />} href={`mailto:${email}`} />;
}
