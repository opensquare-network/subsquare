import { useUser } from "next-common/context/user";
import { isKeyRegisteredUser } from "next-common/utils";
import Link from "next/link";

export default function useSetAvatarPrompt() {
  const user = useUser();
  const isKeyUser = isKeyRegisteredUser(user);
  if (!isKeyUser) {
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
