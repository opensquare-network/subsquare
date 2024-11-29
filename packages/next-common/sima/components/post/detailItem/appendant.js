import { usePost } from "next-common/context/post";
import Duration from "next-common/components/duration";
import AppendantEditor from "./appendantEditor";
import {
  HtmlPreviewer,
  MarkdownPreviewer,
  renderMentionIdentityUserPlugin,
} from "@osn/previewer";
import IdentityOrAddr from "next-common/components/IdentityOrAddr";
import { prettyHTML } from "next-common/utils/viewfuncs";

function AppendItem({ index, data }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <span className="text12Bold text-textPrimary">#{index + 1}</span>
        <span className="text12Medium text-textTertiary">
          <Duration time={data.createdAt} />
        </span>
      </div>
      <div>
        <span className="text-textPrimary">
          {data.contentType === "markdown" && (
            <MarkdownPreviewer
              content={data.content || ""}
              plugins={[renderMentionIdentityUserPlugin(<IdentityOrAddr />)]}
              markedOptions={{
                breaks: true,
              }}
            />
          )}
          {data.contentType === "html" && (
            <HtmlPreviewer
              content={prettyHTML(data.content)}
              plugins={[
                renderMentionIdentityUserPlugin(<IdentityOrAddr />, {
                  targetElement: { tag: "span" },
                }),
              ]}
            />
          )}
        </span>
      </div>
    </div>
  );
}

export default function Appendant({ isAppend, setIsAppend }) {
  const post = usePost();
  const appendants = post?.appendants || [];

  if (appendants.length === 0 && !isAppend) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[16px] mt-[16px] pt-[16px] border-t border-neutral300">
      <span className="text14Bold text-textPrimary">Appendant</span>
      <div className="flex flex-col gap-[16px]">
        {appendants.map((item, index) => (
          <AppendItem key={index} index={index} data={item} />
        ))}
      </div>
      {isAppend && <AppendantEditor setIsAppend={setIsAppend} />}
    </div>
  );
}
