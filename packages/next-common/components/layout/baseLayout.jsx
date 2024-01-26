import CMDKPalette from "../cmdk/cmdkPalette";
import CookiesConsent from "../cookiesConsent";
import Header from "../header";
import Nav from "../nav";
import SEO from "../SEO";
import Toast from "../toast";
import Footer from "./footer";
import useApi from "next-common/utils/hooks/useApi";
import { useBlockTime, useSubscribeChainHead } from "next-common/utils/hooks";
import useUpdateNodesDelay from "next-common/utils/hooks/useUpdateNodesDelay";
import LoginGlobalPopup from "../login/globalPopup";
import useStoreDemocracyLockPeriod from "next-common/hooks/democracy/useStoreDemocracyLockPeriod";
import useStoreConvictionVotingLockPeriod from "next-common/hooks/referenda/useStoreConvictionVotingLockPeriod";
import useConnectApis from "next-common/services/chain/apis/useConnectApis";
import BaseLayoutFrame from "./baseLayoutFrame";

/**
 * @description a base layout includes nav, header and footer
 */
export default function BaseLayout({ children, seoInfo = {} }) {
  useConnectApis();
  useUpdateNodesDelay();

  const api = useApi();
  useBlockTime(api);
  useSubscribeChainHead(api);

  useStoreDemocracyLockPeriod();
  useStoreConvictionVotingLockPeriod();

  return (
    <>
      <SEO {...seoInfo} />

      <BaseLayoutFrame nav={<Nav />} header={<Header />} footer={<Footer />}>
        {children}
      </BaseLayoutFrame>

      <CMDKPalette />
      <Toast />
      <CookiesConsent />
      <LoginGlobalPopup />
    </>
  );
}
