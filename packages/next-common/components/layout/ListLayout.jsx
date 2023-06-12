import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import CMDKPalette from "../cmdk/cmdkPalette";
import CookiesConsent from "../cookiesConsent";
import Header from "../header/v2";
import Nav from "../nav";
import SEO from "../SEO";
import Toast from "../toast";
import Footer from "./footer/v2";

export default function ListLayout({ children, seoInfo = {} }) {
  const { sm } = useScreenSize();

  return (
    <>
      <SEO {...seoInfo} />

      <div className="min-h-screen flex bg-neutral200 max-sm:block">
        <section className="sticky top-0 max-h-screen z-10">
          <Nav />
        </section>

        <section className="flex flex-col flex-1">
          <header className="sticky top-0 z-10">{!sm && <Header />}</header>
          <section className="flex flex-col flex-1">
            <div className="w-full flex-1">{children}</div>
            <footer className="bg-rose-200">
              <Footer />
            </footer>
          </section>
        </section>
      </div>

      <CMDKPalette />
      <Toast />
      <CookiesConsent />
    </>
  );
}
