export default function ListLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-neutral-100">
      <nav className="h-screen bg-teal-200 sticky top-0">menu</nav>

      <section className="flex flex-col flex-1">
        <header className="bg-lime-200 sticky top-0">header</header>
        <section className="flex flex-col flex-1">
          <div className="w-full max-w-[1200px] mx-auto flex-1 bg-amber-200">
            {children || "children"}
          </div>
          <footer className="bg-rose-200">footer</footer>
        </section>
      </section>
    </div>
  );
}
