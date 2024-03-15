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

  if (!content) {
    return (
      <div className="text-center w-full py-[16px]">
        <span className="text-textTertiary text14Medium">
          There is no announcement
        </span>
      </div>
    );
  }

  return <MarkdownPreviewer content={content} />;
}
