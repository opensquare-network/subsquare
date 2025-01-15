export default function ClickableText({ children, onClick }) {
  return (
    <span className="text-theme500 cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
}
