import { MarkdownPreviewer } from "@osn/previewer";

export default function ReferendaDelegateeDetailPopupAnnouncement({
  delegate,
}) {
  const { manifesto } = delegate;
  return <MarkdownPreviewer content={manifesto?.longDescription || ""} />;
}
