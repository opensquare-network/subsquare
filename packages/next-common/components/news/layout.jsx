import Toast from "../toast";
import Button from "next-common/lib/button";
import { useUser } from "next-common/context/user";
import { useIsLoggedIn } from "next-common/context/user";
import Link from "next/link";
import { logoutUser } from "next-common/context/user";
import HeaderAccount from "../header/headerAccount";
import CookiesConsent from "../cookiesConsent";
import LoginGlobalPopup from "../login/globalPopup";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { useUserContext } from "next-common/context/user";
import PrimaryButton from "next-common/lib/button/primary";

export default function NewsLayout({ children }) {
  const userContext = useUserContext();
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const { ensureLogin } = useEnsureLogin();

  return (
    <>
      <div className="bg-neutral100 w-screen h-screen">
        <main className="max-w-7xl mx-auto bg-neutral100 p-2  space-y-4">
          <header className="py-2 space-y-1 flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-bold">
              <Link href="/">SubSquare News Management</Link>
            </h1>
            <HeaderAccount />
          </header>
          <div className="flex gap-2 items-center">
            {isLoggedIn && user && (
              <p className="text-sm text-neutral600" title={user.username}>
                Admin: {user?.username}
              </p>
            )}
            {isLoggedIn ? (
              <Button
                size="small"
                className="text-red-500 px-2 py-1"
                onClick={() => logoutUser(userContext)}
              >
                log out
              </Button>
            ) : (
              <Button
                size="small"
                className="text-blue-500 px-2 py-1"
                onClick={ensureLogin}
              >
                log in
              </Button>
            )}
          </div>
          {isLoggedIn ? (
            children
          ) : (
            <div>
              <PrimaryButton onClick={ensureLogin}>log in</PrimaryButton>
            </div>
          )}
        </main>
      </div>
      <Toast />
      <CookiesConsent />
      <LoginGlobalPopup />
    </>
  );
}
