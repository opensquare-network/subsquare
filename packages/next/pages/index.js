import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    const chain = localStorage.getItem("chain") || "karura";
    router.push(`/${chain}/discussions`);
  }, [router]);

  return null;
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
