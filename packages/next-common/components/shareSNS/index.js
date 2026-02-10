import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import copy from "copy-to-clipboard";
import { OptionItem, OptionWrapper } from "../internalDropdown/styled";
import { getShare2SNStext } from "../../utils/post/share";
import { usePost } from "../../context/post";
import { useDetailType } from "../../context/page";
import { Item } from "../actions/styled";
import { SystemShare } from "@osn/icons/subsquare";
import { useClickAway } from "react-use";

const Wrapper = styled.div`
  position: relative;
  display: flex;

  svg {
    rect {
      fill: var(--textTertiary);
    }

    path {
      fill: var(--textTertiary);
    }
  }

  &:hover {
    color: var(--textSecondary);

    svg {
      rect {
        fill: var(--textSecondary);
      }

      path {
        fill: var(--textSecondary);
      }
    }
  }
`;

const ShareItem = styled.span`
  cursor: pointer;
`;

export default function Share() {
  const post = usePost();
  const type = useDetailType();
  const text = getShare2SNStext(post, type);

  const ref = useRef();
  const [copyState, setCopyState] = useState(false);
  const [showShare, setShowShare] = useState(false);
  useEffect(() => {
    if (copyState) {
      setTimeout(() => {
        setCopyState(false);
      }, 3000);
    }
  }, [copyState]);

  useClickAway(ref, () => setShowShare(false));

  const tweet = () => {
    setShowShare(false);
    const url =
      "https://twitter.com/share?url=" +
      encodeURIComponent(window.location.href) +
      "&text=" +
      encodeURIComponent(text ?? document.title ?? "");
    window.open(url, "_blank");
  };

  return (
    <Wrapper ref={ref}>
      <Item
        onClick={() => {
          setShowShare(true);
        }}
      >
        <SystemShare className="w-5 h-5" />
        <span>Share</span>
      </Item>

      {showShare && (
        <OptionWrapper>
          <OptionItem>
            <ShareItem onClick={tweet}>Twitter</ShareItem>
          </OptionItem>
          <OptionItem
            onClick={() => {
              try {
                copy(window.location.href);
              } catch {
                // fixme: ignore
              } finally {
                setCopyState(true);
              }
            }}
          >
            {copyState ? "Copied" : "Copy Link"}
          </OptionItem>
        </OptionWrapper>
      )}
    </Wrapper>
  );
}
