import _PrimaryButton from "next-common/lib/button/primary";

export default function PrimaryButton({
  children,
  isLoading = false,
  isFill,
  ...props
}) {
  return (
    <_PrimaryButton
      loading={isLoading}
      {...props}
      className={isFill && "w-full"}
    >
      {children}
    </_PrimaryButton>
  );
}
