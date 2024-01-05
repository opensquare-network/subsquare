import SortedSVG from "./sorted.svg";

export default function SortableColumn({ name, sorted = true, onClick }) {
  return (
    <div
      role="button"
      onClick={onClick}
      className="max-sm:pointer-events-none inline-flex items-center gap-2"
    >
      {sorted && <SortedSVG className="max-sm:hidden" />}
      <span>{name}</span>
    </div>
  );
}
