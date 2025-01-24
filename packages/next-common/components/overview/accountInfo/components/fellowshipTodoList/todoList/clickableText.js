export default function ClickableText({ children, onClick }) {
  return (
    <span
      className="text-theme500 cursor-pointer"
      role="button"
      onClick={onClick}
    >
      {children}
    </span>
  );
}
