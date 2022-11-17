import { useRouter } from "next/router";

const gov2pathname = "/referenda";

export function useIsGov2Page() {
  const router = useRouter();
  const { pathname } = router;
  return pathname.startsWith(gov2pathname);
}
