import React, { useState, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import { SystemTop } from "@osn/icons/subsquare";
import styled from "styled-components";

const ScrollToTopDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  cursor: pointer;
  bottom: 96px;
  right: 24px;
  z-index: 1000;
  border-radius: 8px;
  box-shadow:
    0px 6px 7px 0px rgba(30, 33, 52, 0.02),
    0px 1.34px 1.564px 0px rgba(30, 33, 52, 0.01),
    0px 0.399px 0.466px 0px rgba(30, 33, 52, 0.01);
`;

export default function ScrollToTopButton({ scrollYShowPX = 800 }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > scrollYShowPX);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    scroll.scrollToTop();
  };

  return (
    showButton && (
      <ScrollToTopDiv
        className={"w-10 h-10 bg-neutral100 border-neutral400 border"}
        onClick={handleClick}
      >
        <SystemTop className="text-textPrimary" />
      </ScrollToTopDiv>
    )
  );
}
