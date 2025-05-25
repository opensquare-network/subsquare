import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import CMDKPalette from "../cmdk/cmdkPalette";
import CookiesConsent from "../cookiesConsent";
import Header from "../header";
import Nav from "../nav";
import SEO from "../SEO";
import Toast from "../toast";
import Footer from "./footer";
import { useBlockTime, useSubscribeChainHead } from "next-common/utils/hooks";
import useUpdateNodesDelay from "next-common/utils/hooks/useUpdateNodesDelay";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import LoginGlobalPopup from "../login/globalPopup";
import useStoreDemocracyLockPeriod from "next-common/hooks/democracy/useStoreDemocracyLockPeriod";
import useStoreConvictionVotingLockPeriod from "next-common/hooks/referenda/useStoreConvictionVotingLockPeriod";
import { useContextApi } from "next-common/context/api";
import useExistentialDeposit from "next-common/utils/hooks/chain/useExistentialDeposit";
import GlobalNotification from "next-common/components/globalNotification";
import useInitApiProviders from "next-common/services/chain/apis/useInitApiProviders";
import useInitMimir from "next-common/hooks/useInitMimir";
import { usePageProperties } from "next-common/context/page";
import { useSubScanHeight } from "next-common/hooks/scanHeight";
import MaybeSubRelayStatus from "../maybeSubRelayStatus";

/**
 * @description a base layout includes nav, header and footer
 */
export default function BaseLayout({
  children,
  seoInfo = {},
  contentStyle = {},
}) {
  const { scanHeight, relayScanHeight } = usePageProperties();
  const { sm } = useScreenSize();
  const [navCollapsed] = useNavCollapsed();

  useInitMimir();
  useInitApiProviders();
  useUpdateNodesDelay();

  const api = useContextApi();
  useBlockTime(api);

  useSubScanHeight(scanHeight);
  useSubscribeChainHead(api);
  useExistentialDeposit();

  useStoreDemocracyLockPeriod();
  useStoreConvictionVotingLockPeriod();

  return (
    <MaybeSubRelayStatus relayScanHeight={relayScanHeight}>
      <SEO {...seoInfo} />

      <div className="min-h-screen flex bg-pageBg max-sm:flex-col">
        <section className="sticky top-0 max-h-screen z-50">
          <Nav />
        </section>

        <section
          className={cn(
            "flex flex-col flex-1",
            navCollapsed
              ? "max-w-[calc(100%-72px)]"
              : "max-w-[calc(100%-300px)]",
            "max-sm:max-w-full",
          )}
        >
          {!sm && (
            <div className="sticky top-0 z-50 max-sm:hidden">
              <Header />
            </div>
          )}

          <GlobalNotification />

          <section className="flex flex-col flex-1" style={contentStyle}>
            {children}
          </section>

          <footer>
            <Footer />
          </footer>
        </section>
      </div>

      <CMDKPalette />
      <Toast />
      <CookiesConsent />
      <LoginGlobalPopup />
    </MaybeSubRelayStatus>
  );
}
