import SecondaryButton from "next-common/lib/button/secondary";

export default function GhostButton({
  children,
  isLoading = false,
  isFill,
  ...props
}) {
  return (
    <SecondaryButton
      loading={isLoading}
      {...props}
      className={isFill && "w-full"}
    >
      {children}
    </SecondaryButton>
  );
}
