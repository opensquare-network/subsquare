import Header from "../header/v2";

export default function ListLayout({ children, footer, nav }) {
  return (
    <div className="min-h-screen flex bg-neutral200 max-sm:block">
      <section className="sticky top-0 max-h-screen bg-teal-200">
        <nav>{nav || "navigation"}</nav>
      </section>

      <section className="flex flex-col flex-1">
        <header className="sticky top-0 z-10">
          <Header />
        </header>
        <section className="flex flex-col flex-1">
          <div className="w-full max-w-[1200px] mx-auto flex-1">{children}</div>
          <footer className="bg-rose-200">{footer || "footer"}</footer>
        </section>
      </section>
    </div>
  );
}
