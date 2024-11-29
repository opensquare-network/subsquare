import { HtmlPreviewer, MarkdownPreviewer } from "@osn/previewer";

export default function ReferendaDelegateeDetailPopupAnnouncement({
  delegate,
}) {
  const { manifesto, announcement, announcementContentType } = delegate;

  let content = "";
  let contentType = "markdown";

  if (announcement) {
    content = announcement;
    contentType = announcementContentType;
  } else {
    switch (manifesto?.source) {
      case "nova":
      case "sima":
        content = manifesto?.longDescription || "";
        break;
      case "parity":
        content = manifesto?.manifesto || "";
        break;
    }
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

  return contentType === "markdown" ? (
    <MarkdownPreviewer
      content={content}
      markedOptions={{
        breaks: true,
      }}
    />
  ) : (
    <HtmlPreviewer content={content} />
  );
}
