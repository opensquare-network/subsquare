import { cn } from "next-common/utils";
import { useChain, useChainSettings } from "next-common/context/chain";
import { useToggle } from "react-use";
import NavMenu from "./menu";
import tw from "tailwind-styled-components";
import HeaderDrawer from "../header/drawer";
import { ArrowFold, SystemClose, SystemMenu } from "@osn/icons/subsquare";
import Link from "next-common/components/link";
import { useNavCollapsed } from "next-common/context/nav";
import { useScrollLock } from "next-common/utils/hooks/useScrollLock";
import { useEffect, useMemo, useState } from "react";
import ChainLogo from "./logo";
import Chains from "next-common/utils/consts/chains";
import { useThemeSetting } from "next-common/context/theme";
import useDetectDevice from "next-common/components/header/hooks/useDetectDevice";
import { useMountedState } from "react-use";
import { useIsMobileDevice } from "next-common/hooks/useIsMobileDevice";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

export default function Nav() {
  const isMobileFromUA = useIsMobileDevice();
  const isMobileFromDetect = useDetectDevice();
  const isMounted = useMountedState();

  const isMobileDevice = useMemo(() => {
    if (!isMounted()) {
      return isMobileFromUA;
    }

    return isMobileFromDetect;
  }, [isMobileFromDetect, isMobileFromUA, isMounted]);

  return (
    <>
      {!isMobileDevice && <NavDesktop />}
      <NavMobile />
    </>
  );
}

function ChainName() {
  const chainSettings = useChainSettings();

  return (
    <h2 className="text20BoldLogo text-navigationLogoText max-sm:text-[20px] max-sm:font-[28px]">
      {chainSettings.name}
    </h2>
  );
}

const BrandingHintMap = {
  [Chains.westendAssetHub]: "Westend Asset Hub Management",
};

const getBrandingHint = (chain) => {
  return BrandingHintMap[chain] || "Governance by Subsquare";
};

function BrandingHint() {
  const chain = useChain();

  return (
    <div className="text12Medium mt-1 max-sm:mt-0 text-navigationTextTertiary">
      {getBrandingHint(chain)}
    </div>
  );
}

const ToggleMenuButton = tw.button`
w-6 h-6 bg-navigationActive rounded
[&_svg_path]:stroke-navigationTextTertiary
`;

const MotionNav = motion.nav;

const desktopNavVariants = {
  collapsed: {
    width: 72,
    transition: { duration: 0.22, ease: "easeIn" },
  },
  expanded: {
    width: 300,
    transition: { duration: 0.26, ease: "easeOut" },
  },
};

function NavDesktop() {
  const [navCollapsed, setNavCollapsed] = useNavCollapsed();
  const [contentCollapsed, setContentCollapsed] = useState(navCollapsed);
  const { navigationBgFrom, navigationBgTo } = useThemeSetting();

  const handleNavAnimationStart = () => {
    if (!navCollapsed) {
      setContentCollapsed(false);
    }
  };

  const handleNavAnimationComplete = () => {
    setContentCollapsed(navCollapsed);
  };

  return (
    <MotionConfig reducedMotion="user">
      <MotionNav
        initial={false}
        animate={navCollapsed ? "collapsed" : "expanded"}
        variants={desktopNavVariants}
        onAnimationStart={handleNavAnimationStart}
        onAnimationComplete={handleNavAnimationComplete}
        className={cn(
          "border-r border-neutral300",
          "max-w-[300px] max-sm:hidden h-full overflow-x-hidden overflow-y-scroll",
          "bg-navigationBg dark:bg-neutral100 text-navigationText",
          "scrollbar-hidden",
        )}
        style={
          navigationBgFrom &&
          navigationBgTo && {
            backgroundImage: `linear-gradient(180deg, ${navigationBgFrom}, ${navigationBgTo})`,
          }
        }
      >
        <div>
          <ChainLogo className="p-4 flex" />
          <div className="py-4 px-6 flex justify-between h-[84px]">
            <Link href="/" className="min-w-0">
              <div
                className={cn(
                  "whitespace-nowrap",
                  contentCollapsed && "hidden",
                )}
              >
                <ChainName />
                <BrandingHint />
              </div>
            </Link>
            <div className="shrink-0">
              <ToggleMenuButton onClick={() => setNavCollapsed(!navCollapsed)}>
                <ArrowFold
                  className={cn(
                    "transition-transform motion-reduce:transition-none",
                    navCollapsed
                      ? "duration-[220ms] ease-in"
                      : "duration-[260ms] ease-out",
                    navCollapsed && "rotate-180",
                  )}
                />
              </ToggleMenuButton>
            </div>
          </div>
        </div>

        <div className="p-4">
          <NavMenu collapsed={contentCollapsed} />
        </div>
      </MotionNav>
    </MotionConfig>
  );
}

const NavMobileToolbarItem = tw.div`
w-[72px] flex items-center justify-center
`;
const NavMobileFloatContainer = tw.div`
fixed bottom-0 top-16 left-0 right-0
w-full p-4 overflow-y-scroll
`;
const MotionNavMobileFloatContainer = motion(NavMobileFloatContainer);

const leftMenuVariants = {
  hidden: {
    x: -24,
    opacity: 0,
    transition: { duration: 0.16, ease: "easeIn" },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

const topMenuVariants = {
  hidden: {
    y: -16,
    opacity: 0,
    transition: { duration: 0.16, ease: "easeIn" },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

function NavMobile() {
  const [menuVisible, menuToggle] = useToggle(false);
  const [toolbarVisible, toolbarToggle] = useToggle(false);
  const [, setLocked] = useScrollLock();

  useEffect(() => {
    if (menuVisible || toolbarVisible) {
      setLocked(true);
    } else {
      setLocked(false);
    }
  }, [menuVisible, setLocked, toolbarVisible]);

  return (
    <nav
      className={cn(
        "border-b border-neutral300 bg-navigationBg dark:bg-neutral100 text-navigationText",
        "sm:hidden",
      )}
    >
      <div className={cn("h-16", "flex items-center justify-between")}>
        <NavMobileToolbarItem>
          <ToggleMenuButton onClick={menuToggle}>
            <ArrowFold
              className={cn(
                "transition-transform duration-200 ease-out motion-reduce:transition-none",
                !menuVisible && "rotate-180",
              )}
            />
          </ToggleMenuButton>
        </NavMobileToolbarItem>
        <Link href="/">
          <div className="text-center">
            <ChainName />
            <BrandingHint />
          </div>
        </Link>
        <NavMobileToolbarItem>
          <div role="button" onClick={toolbarToggle}>
            <SystemMenu
              className={cn(
                "[&_path]:fill-navigationText",
                toolbarVisible && "hidden",
              )}
            />
            <SystemClose
              className={cn(
                "[&_path]:fill-navigationText",
                !toolbarVisible && "hidden",
              )}
            />
          </div>
        </NavMobileToolbarItem>
      </div>

      <MotionConfig reducedMotion="user">
        <AnimatePresence initial={false}>
          {menuVisible && (
            <MotionNavMobileFloatContainer
              key="navigation-menu"
              variants={leftMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-navigationBg"
            >
              <NavMenu />
            </MotionNavMobileFloatContainer>
          )}

          {toolbarVisible && (
            <MotionNavMobileFloatContainer
              key="toolbar-menu"
              variants={topMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-neutral100"
            >
              <HeaderDrawer />
            </MotionNavMobileFloatContainer>
          )}
        </AnimatePresence>
      </MotionConfig>
    </nav>
  );
}
