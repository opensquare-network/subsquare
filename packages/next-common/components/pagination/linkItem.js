import Link from "next-common/components/link";
import { useRouter } from "next/router";

export default function LinkItem({ children, shallow, page }) {
  const router = useRouter();
  const [url, query] = router.asPath.split("?");
  const urlParams = new URLSearchParams(query);
  urlParams.set("page", page);

  return (
    <Link
      shallow={shallow}
      scroll={!shallow}
      href={`${url}?${urlParams}`}
      passHref
      className="inline-flex"
    >
      {children}
    </Link>
  );
}
