import PrimaryButton from "next-common/lib/button/primary";

export default function MaybeProxyEditButton({
  isSima = false,
  isProxy = false,
  ...props
}) {
  if (isSima && isProxy) {
    return <PrimaryButton {...props}>Update as Proxy</PrimaryButton>;
  }
  return <PrimaryButton {...props}>Update</PrimaryButton>;
}
