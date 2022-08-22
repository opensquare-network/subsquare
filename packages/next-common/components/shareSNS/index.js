import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ShareSvg from "../../assets/imgs/icons/share.svg";
import { shadow_200 } from "../../styles/componentCss";
import Flex from "../styled/flex";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import copy from "copy-to-clipboard";

const ShareIcon = styled(ShareSvg)``;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  padding-left: 16px;
  height: 14px;

  > div {
    gap: 8px;
  }

  cursor: pointer;

  > div:hover {
    svg {
      rect {
        fill: ${(props) => props.theme.textSecondary};
      }

      path {
        fill: ${(props) => props.theme.textSecondary};
      }
    }
  }
`;

const ShareItem = styled.span`
  cursor: pointer;
`;

const OptionWrapper = styled.div`
  position: absolute;
  right: -60px;
  bottom: calc(100% + 10px);
  background: ${(props) => props.theme.neutral};
  width: 96px;
  padding: 8px 0;
  border-radius: 4px;
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)}px;
  border-style: ${(props) => (props.theme.isDark ? "solid" : "none")};
  border-color: ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
  ${shadow_200};
`;

const OptionItem = styled.div`
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  padding: 0 12px;
  font-weight: 500;
  color: ${(props) => props.theme.textPrimary};

  :hover {
    background: ${(props) => props.theme.grey100Bg};
  }
`;

export default function Share({ share2SNStext = "" }) {
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
    const url =
      "https://twitter.com/share?url=" +
      encodeURIComponent(window.location.href) +
      "&text=" +
      encodeURIComponent(share2SNStext ?? document.title);
    window.open(
      url,
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
    );
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
