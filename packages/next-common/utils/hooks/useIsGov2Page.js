import router from "next/router";

const gov2pathname = "/referenda";

export function useIsGov2Page() {
  const { pathname } = router;
  return pathname.startsWith(gov2pathname);
}
