import NextLink from "next/link";
export default function Link({ href = "", children, ...rest }) {
  return (
    <NextLink href={href} {...rest}>
      {children}
    </NextLink>
  );
}
