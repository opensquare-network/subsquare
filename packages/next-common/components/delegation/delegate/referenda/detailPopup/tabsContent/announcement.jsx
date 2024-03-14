import { MarkdownPreviewer } from "@osn/previewer";

export default function ReferendaDelegateeDetailPopupAnnouncement({
  delegate,
}) {
  const { manifesto } = delegate;

  let content = "";

  switch (manifesto?.source) {
    case "nova":
      content = manifesto?.longDescription || "";
      break;
    case "parity":
      content = manifesto?.manifesto || "";
      break;
  }

  return <MarkdownPreviewer content={content} />;
}
