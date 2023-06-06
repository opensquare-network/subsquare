export default function ListLayout({ children, footer, nav, header }) {
  return (
    <div className="min-h-screen flex bg-neutral-100 max-sm:block">
      <section className="sticky top-0 max-h-screen bg-teal-200">
        <nav>{nav || "navigation"}</nav>
      </section>

      <section className="flex flex-col flex-1">
        <header className="bg-lime-200 sticky top-0">
          {header || "header functions toolbar"}
        </header>
        <section className="flex flex-col flex-1">
          <div className="w-full max-w-[1200px] mx-auto flex-1 bg-amber-200">
            {children || "children"}
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i}>{i}</div>
            ))}
          </div>
          <footer className="bg-rose-200">{footer || "footer"}</footer>
        </section>
      </section>
    </div>
  );
}
