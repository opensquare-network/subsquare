import Link from "next-common/components/link";
import { useRouter } from "next/router";

export default function ShallowLink({ href, children, ...props }) {
  const router = useRouter();
  const currPathname = router.asPath.split("?")[0];
  const toPathname = href.split("?")[0];

  if (currPathname === toPathname) {
    return (
      <Link
        className="text-theme500"
        href={href}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          router.push(href, undefined, { shallow: true });
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link className="text-theme500" href={href} {...props}>
      {children}
    </Link>
  );
}
