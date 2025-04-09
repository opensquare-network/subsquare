import SecondaryButton from "next-common/lib/button/secondary";

export default function ActionButton({ children, onClick }) {
  return (
    <SecondaryButton size="small" onClick={onClick}>
      {children}
    </SecondaryButton>
  );
}
