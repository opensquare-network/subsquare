import HintMessage from "next-common/components/styled/hintMessage";
import NextLink from "next-common/components/styled/nextLink";
import useIsProxySet from "next-common/hooks/useIsProxySet";

export default function ProxyHint({ style }) {
  const isProxySet = useIsProxySet();
  if (!isProxySet) {
    return null;
  }

  return (
    <HintMessage style={style}>
      Votes of your proxied account, please&nbsp;
      <NextLink href="/settings/proxy">unset your proxy setting</NextLink>
      &nbsp;to see the votes of login account.
    </HintMessage>
  );
}
