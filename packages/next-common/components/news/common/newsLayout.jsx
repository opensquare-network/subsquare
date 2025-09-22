import Link from "next/link";
import {
  logoutUser,
  useUser,
  useIsLoggedIn,
  useUserContext,
} from "next-common/context/user";
import Button from "next-common/lib/button";
import Toast from "next-common/components/toast";
import PrimaryButton from "next-common/lib/button/primary";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import CookiesConsent from "next-common/components/cookiesConsent";
import HeaderAccount from "next-common/components/header/headerAccount";
import LoginGlobalPopup from "next-common/components/login/globalPopup";

export default function NewsLayout({ children }) {
  const userContext = useUserContext();
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const { ensureLogin } = useEnsureLogin();

  return (
    <>
      <div className="bg-neutral100 w-screen h-screen overflow-auto">
        <main className="max-w-7xl mx-auto bg-neutral100 p-4  space-y-4 text-textPrimary">
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
            {isLoggedIn && (
              <Button
                size="small"
                className="text-red-500 px-2 py-1"
                onClick={() => logoutUser(userContext)}
              >
                log out
              </Button>
            )}
          </div>
          {isLoggedIn ? (
            children
          ) : (
            <div className="w-full flex items-center">
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
