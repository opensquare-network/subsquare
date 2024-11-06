import { useDetailType } from "next-common/context/page";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";
import { prettyHTML, toApiType } from "next-common/utils/viewfuncs";
import { useCallback } from "react";

export function useGetComment() {
  return useCallback(async (comment) => {
    return await nextApi.fetch(`comments/${comment._id}`);
  }, []);
}

export function useUpdateOffChainComment() {
  const { ensureLogin } = useEnsureLogin();

  return useCallback(
    async (post, replyToComment, comment, content, contentType) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await nextApi.patch(`comments/${comment._id}`, {
        content: contentType === "html" ? prettyHTML(content) : content,
        contentType,
      });
    },
    [ensureLogin],
  );
}

export function useCreateOffChainComment() {
  const type = useDetailType();
  const { ensureLogin } = useEnsureLogin();

  return useCallback(
    async (post, content, contentType) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await nextApi.post(
        `${toApiType(type)}/${post._id}/comments`,
        {
          content: contentType === "html" ? prettyHTML(content) : content,
          contentType,
        },
        { credentials: "include" },
      );
    },
    [type, ensureLogin],
  );
}

export function useCreateOffChainCommentReply() {
  const type = useDetailType();
  const { ensureLogin } = useEnsureLogin();

  return useCallback(
    async (post, comment, content, contentType) => {
      if (!(await ensureLogin())) {
        throw new Error("Cancelled");
      }

      return await nextApi.post(
        `${toApiType(type)}/${post._id}/comments/${comment._id}/replies`,
        {
          content: contentType === "html" ? prettyHTML(content) : content,
          contentType,
        },
        { credentials: "include" },
      );
    },
    [type, ensureLogin],
  );
}
