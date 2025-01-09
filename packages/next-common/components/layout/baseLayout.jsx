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
import useConnectApis from "next-common/services/chain/apis/useConnectApis";
import { useContextApi } from "next-common/context/api";
import useExistentialDeposit from "next-common/utils/hooks/chain/useExistentialDeposit";

/**
 * @description a base layout includes nav, header and footer
 */
export default function BaseLayout({ children, seoInfo = {} }) {
  console.log("BaseLayout", BaseLayout);

  const { sm } = useScreenSize();
  const [navCollapsed] = useNavCollapsed();
  useConnectApis();
  useUpdateNodesDelay();

  const api = useContextApi();
  useBlockTime(api);
  useSubscribeChainHead(api);
  useExistentialDeposit();
  const addr = "118a1C8pkEuBcTuRPCHVh6JjaPm2Yq6vLK4CVKmMh3DXDjW";
  const trackId = 0;
  if (api) {
    console.log("api", api.isConnected);
    api.query.convictionVoting.votingFor(addr, trackId, (voting) => {
      console.log("hello", voting?.toJSON()?.casting);
    });
  }

  useStoreDemocracyLockPeriod();
  useStoreConvictionVotingLockPeriod();

  return (
    <>
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

          <section className="flex flex-col flex-1">{children}</section>

          <footer>
            <Footer />
          </footer>
        </section>
      </div>

      <CMDKPalette />
      <Toast />
      <CookiesConsent />
      <LoginGlobalPopup />
    </>
  );
}
