import { useScreenSize } from "next-common/utils/hooks/useScreenSize";
import Header from "../header/v2";
import Nav from "../nav";

export default function ListLayout({ children, footer }) {
  const { sm } = useScreenSize();

  return (
    <div className="min-h-screen flex bg-neutral200 max-sm:block">
      <section className="sticky top-0 max-h-screen z-10">
        <Nav />
      </section>

      <section className="flex flex-col flex-1">
        <header className="sticky top-0 z-10">{!sm && <Header />}</header>
        <section className="flex flex-col flex-1">
          <div className="w-full max-w-[1200px] mx-auto flex-1">{children}</div>
          <footer className="bg-rose-200">{footer || "footer"}</footer>
        </section>
      </section>
    </div>
  );
}
