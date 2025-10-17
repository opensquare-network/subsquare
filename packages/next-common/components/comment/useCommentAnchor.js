import { useEffect } from "react";
import useRouterAnchor from "next-common/utils/hooks/useRouterAnchor";
import { useComment } from "./context";

function jumpToAnchor(anchorId) {
  var anchorElement = document.getElementById(anchorId);
  if (!anchorElement) {
    return;
  }
  var bodyRect = document.body.getBoundingClientRect();
  var elementRect = anchorElement.getBoundingClientRect();
  var offset = elementRect.top - bodyRect.top;
  var scrollPosition = offset - window.innerHeight / 2;
  window.scrollTo({
    top: scrollPosition,
    behavior: "smooth",
  });
}

export function useCurrentCommentAnchor() {
  const comment = useComment();
  if (comment.comment_source === "subsquare-reply-to-polkassembly-comment") {
    return comment.polkassemblyCommentId + "-reply-" + comment.height;
  }
  return `${comment.height}`;
}

export function useJumpCommentAnchor() {
  const currentCommentAnchor = useCurrentCommentAnchor();
  const { hasAnchor: hasRouterAnchor, anchor: routerAnchor } =
    useRouterAnchor();
  const isCurrentCommentAnchored =
    hasRouterAnchor && routerAnchor === currentCommentAnchor;

  // Jump to comment when anchor is set
  useEffect(() => {
    if (!isCurrentCommentAnchored) {
      return;
    }
    setTimeout(() => {
      jumpToAnchor(currentCommentAnchor);
    }, 100);
  }, [isCurrentCommentAnchored, currentCommentAnchor]);

  return { isCurrentCommentAnchored, currentCommentAnchor, hasRouterAnchor };
}
