import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import CMDKPalette from "../cmdk/cmdkPalette";
import CookiesConsent from "../cookiesConsent";
import Header from "../header";
import Nav from "../nav";
import SEO from "../SEO";
import Toast from "../toast";
import Footer from "./footer";
import LoginGlobalPopup from "../login/globalPopup";
import GlobalNotification from "next-common/components/globalNotification";
import { ScanHeightSubscriber } from "../scanHeightSubscriber";
import NativeTokenPriceSubscriber from "next-common/components/common/price/subscriber";
import BaseInit from "next-common/components/init";

/**
 * @description a base layout includes nav, header and footer
 */
export default function BaseLayout({
  children,
  seoInfo = {},
  contentStyle = {},
}) {
  const { sm } = useScreenSize();

  return (
    <>
      <BaseInit />
      <SEO {...seoInfo} />

      <div className="min-h-screen flex bg-pageBg max-sm:flex-col">
        <section className="sticky top-0 max-h-screen z-50">
          <Nav />
        </section>

        <section className="flex min-w-0 flex-1 flex-col">
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
      <NativeTokenPriceSubscriber />
      <ScanHeightSubscriber />
    </>
  );
}
