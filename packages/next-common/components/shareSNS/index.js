import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ShareSvg from "../../assets/imgs/icons/share.svg";
import Flex from "../styled/flex";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import copy from "copy-to-clipboard";
import { OptionItem, OptionWrapper } from "../internalDropdown/styled";
import { getShare2SNStext } from "../../utils/post/share";
import { usePost } from "../../context/post";
import { useDetailType } from "../../context/page";

const ShareIcon = styled(ShareSvg)``;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  padding-left: 16px;
  height: 14px;
  color: var(--textTertiary);
  cursor: pointer;

  > div {
    gap: 8px;
  }

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

  useOnClickOutside(ref, () => setShowShare(false));

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
      <Flex
        onClick={() => {
          setShowShare(true);
        }}
      >
        <ShareIcon className="share" />
        <span>Share</span>
      </Flex>
      {showShare && (
        <OptionWrapper>
          <OptionItem>
            <ShareItem onClick={tweet}>Twitter</ShareItem>
          </OptionItem>
          <OptionItem
            onClick={() => {
              try {
                copy(window.location.href);
              } catch (e) {
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
