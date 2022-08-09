import { useCallback } from "react";
import styled from "styled-components";
import Twitter from "../../assets/imgs/icons/share.svg";

const Wrapper = styled.div`
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
      <ShareItem onClick={tweet}>
        <Twitter className="twitter" />
      </ShareItem>
    </Wrapper>
  );
}
