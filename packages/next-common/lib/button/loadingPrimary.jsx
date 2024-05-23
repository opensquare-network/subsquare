import LoadingButton from "next-common/lib/button/loading";
import PrimaryButton from "next-common/lib/button/primary";

export default function LoadingPrimaryButton({
  loading,
  loadingText,
  children,
  ...props
}) {
  if (loading) {
    return <LoadingButton>{loadingText || children}</LoadingButton>;
  } else {
    return <PrimaryButton {...props}>{children}</PrimaryButton>;
  }
}
