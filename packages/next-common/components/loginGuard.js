import { useUser } from "next-common/context/user";

export default function LoginGuard({ fallback, children }) {
  const user = useUser();
  if (!user) {
    return fallback;
  }

  return children;
}
