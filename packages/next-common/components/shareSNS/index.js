import { useCallback } from "react";
import styled from "styled-components";
import Twitter from "../../assets/imgs/icons/share.svg";
import { shadow_200 } from "../../styles/componentCss";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
`;

const ShareItem = styled.span`
  cursor: pointer;
  &:hover {
    .twitter {
      rect {
        fill: #e6f4fe;
      }
      path {
        fill: #33a2f2;
      }
    }
  }
`;

const OptionWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 100%;
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

export default function Share({}) {
  const tweet = useCallback(() => {
    const url =
      "https://twitter.com/share?url=" +
      encodeURIComponent(window.location.href) +
      "&text=" +
      encodeURIComponent(document.title);
    window.open(
      url,
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
    );
  }, []);

  return (
    <Wrapper>
      <Twitter className="twitter" />
      Share
      <OptionWrapper>
        <OptionItem>
          <ShareItem onClick={tweet}>Twitter</ShareItem>
        </OptionItem>
        <OptionItem>Copy Link</OptionItem>
      </OptionWrapper>
    </Wrapper>
  );
}
