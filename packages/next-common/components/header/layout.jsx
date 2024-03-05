export default function HeaderLayout({ search, account }) {
  return (
    <header className="py-4 px-6 flex gap-x-6 border-b border-neutral300 bg-neutral100">
      <div className="flex-1">{search}</div>
      <div className="flex gap-x-2 relative">{account}</div>
    </header>
  );
}
