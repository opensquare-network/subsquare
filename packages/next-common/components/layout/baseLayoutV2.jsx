import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import CMDKPalette from "../cmdk/cmdkPalette";
import CookiesConsent from "../cookiesConsent";
import Header from "../header/v2";
import Nav from "../nav";
import SEO from "../SEO";
import Toast from "../toast";
import Footer from "./footer/v2";
import useApi from "next-common/utils/hooks/useApi";
import {
  useBlockTime,
  useChainHeight,
  useSubscribeChainHead,
} from "next-common/utils/hooks";
import { useDispatch } from "react-redux";
import { useIsMountedBool } from "next-common/utils/hooks/useIsMounted";
import useUpdateNodesDelay from "next-common/utils/hooks/useUpdateNodesDelay";
import { useEffect } from "react";
import {
  setBlockTime,
  setLatestHeight,
  setNowHeight,
} from "next-common/store/reducers/chainSlice";
import clsx from "clsx";
import { useNavCollapsed } from "next-common/context/nav";

/**
 * @description a base layout includes nav, header and footer
 */
export default function BaseLayout({ children, seoInfo = {} }) {
  const { sm } = useScreenSize();
  const [navCollapsed] = useNavCollapsed();

  const api = useApi();
  const blockTime = useBlockTime(api);
  const latestHeight = useSubscribeChainHead(api);
  const nowHeight = useChainHeight(api);

  const dispatch = useDispatch();
  const isMounted = useIsMountedBool();

  useUpdateNodesDelay();

  useEffect(() => {
    if (blockTime && isMounted()) {
      dispatch(setBlockTime(blockTime.toNumber()));
    }
  }, [blockTime, dispatch, isMounted]);

  useEffect(() => {
    if (latestHeight && isMounted()) {
      dispatch(setLatestHeight(latestHeight));
    }
  }, [latestHeight, dispatch, isMounted]);

  useEffect(() => {
    dispatch(setNowHeight(nowHeight));
  }, [nowHeight, dispatch]);

  return (
    <>
      <SEO {...seoInfo} />

      <div className="min-h-screen flex bg-pageBg max-sm:flex-col">
        <section className="sticky top-0 max-h-screen z-20">
          <Nav />
        </section>

        <section
          className={clsx(
            "flex flex-col flex-1",
            navCollapsed
              ? "max-w-[calc(100%-72px)]"
              : "max-w-[calc(100%-300px)]",
            "max-sm:max-w-full",
          )}
        >
          {!sm && (
            <div className="sticky top-0 z-10 max-sm:hidden">
              <Header />
            </div>
          )}

          <section className="flex flex-col flex-1">{children}</section>

          <footer>
            <Footer />
          </footer>
        </section>
      </div>

      <CMDKPalette />
      <Toast />
      <CookiesConsent />
    </>
  );
}
