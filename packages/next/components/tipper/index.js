import styled from "styled-components";
import { useState } from "react";
import dynamic from "next/dynamic";

import Button from "components/button";
import User from "components/user";

const Popup = dynamic(() => import("./popup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  width: 280px;
  margin-top: 0 !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 1444px) {
    position: static;
    width: auto;
  }
`;

const Content = styled.div`
  padding: 24px;
  background: #ebeef4;
  border-radius: 6px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 100%;
  margin-bottom: 16px;
`;

const NoTippers = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 140%;
  color: #9da9bb;
`;

const SitllTip = styled.div`
  font-size: 12px;
  line-height: 140%;
  color: #9da9bb;
  > span {
    color: #6848ff;
    cursor: pointer;
  }
`;

const TipperList = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const TipperItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
`;

export default function Tipper({ chain }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Wrapper>
        <Content>
          <Title>Tippers</Title>
          {/* <NoTippers>No current tippers</NoTippers> */}
          <TipperList>
            <TipperItem>
              <User add="rU372H6Tsj11cUWoiB4aPxiJNs3e6p2oWtsefm2TTVKzr2t" />
              <div>500 PHA</div>
            </TipperItem>
            <TipperItem>
              <User add="rU372H6Tsj11cUWoiB4aPxiJNs3e6p2oWtsefm2TTVKzr2t" />
              <div>500 PHA</div>
            </TipperItem>
            <TipperItem>
              <User add="rU372H6Tsj11cUWoiB4aPxiJNs3e6p2oWtsefm2TTVKzr2t" />
              <div>500 PHA</div>
            </TipperItem>
          </TipperList>
        </Content>
        <Button secondary isFill onClick={() => setShowPopup(true)}>
          Endorse
        </Button>
        <SitllTip>
          Only council members can tip, no account found from the council.{" "}
          <span onClick={() => setShowPopup(true)}>Still tip</span>
        </SitllTip>
      </Wrapper>
      {showPopup && <Popup chain={chain} onClose={() => setShowPopup(false)} />}
    </>
  );
}
