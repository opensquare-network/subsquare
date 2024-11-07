import { SystemAiSummary, SystemLoading } from "@osn/icons/subsquare";
import { MarkdownPreviewer } from "@osn/previewer";
import nextApi from "next-common/services/nextApi";
import { gov2ReferendumsDetailApi } from "next-common/services/url";
import { useAsyncFn } from "react-use";
import Tooltip from "../tooltip";
import { useEffect, useState } from "react";

export default function PostListAISummary({ data }) {
  const [started, setStarted] = useState(false);

  const [{ loading, value }, fetch] = useAsyncFn(async () => {
    const resp = await nextApi.fetch(
      gov2ReferendumsDetailApi(data?.referendumIndex),
    );

    return resp?.result?.contentSummary?.summary;
  }, [data?.referendumIndex]);

  useEffect(() => {
    if (started) {
      fetch();
    }
  }, [started, fetch]);

  const tooltipContent = loading ? (
    <SystemLoading className="w-4 h-4" />
  ) : (
    <MarkdownPreviewer
      className="!text-inherit max-w-4xl"
      content={value || "No more content to summarize"}
    />
  );

  return (
    <Tooltip content={tooltipContent}>
      <SystemAiSummary
        className="w-4 h-4 text-textTertiary hover:text-textSecondary hover:cursor-pointer stroke-current stroke-[0.5]"
        onMouseEnter={() => {
          setStarted(true);
        }}
      />
    </Tooltip>
  );
}
