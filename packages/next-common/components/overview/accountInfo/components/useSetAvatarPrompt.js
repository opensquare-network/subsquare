import { useIsWeb3User } from "next-common/context/user";
import Link from "next/link";

export default function useSetAvatarPrompt() {
  const isWeb3User = useIsWeb3User();
  if (!isWeb3User) {
    return null;
  }

  return (
    <div>
      Set an avatar to make you remarkable! Upload your image{" "}
      <Link className="underline" href={"/settings/key-account"}>
        here
      </Link>
    </div>
  );
}
