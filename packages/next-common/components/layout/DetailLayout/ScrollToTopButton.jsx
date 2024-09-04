import React, { useState, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import { SystemTop } from "@osn/icons/subsquare";

export default function ScrollToTopButton({ scrollYShowPX = 800 }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > scrollYShowPX);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    scroll.scrollToTop();
  };

  return (
    showButton && (
      <div
        className={
          "flex items-center justify-center fixed cursor-pointer bottom-[96px] right-[24px] z-50 rounded-lg w-10 h-10 bg-neutral100 border-neutral400 border shadow-shadow100"
        }
        onClick={handleClick}
      >
        <SystemTop className="text-textPrimary" />
      </div>
    )
  );
}
