import Link from "next/link";
import { useIsLoggedIn } from "next-common/context/user";
import Toast from "next-common/components/toast";
import PrimaryButton from "next-common/lib/button/primary";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import CookiesConsent from "next-common/components/cookiesConsent";
import HeaderAccount from "next-common/components/header/headerAccount";
import LoginGlobalPopup from "next-common/components/login/globalPopup";
import useIsAdmin from "next-common/hooks/useIsAdmin";
import { ImgNotMemberDark, ImgNotMemberLight } from "@osn/icons/subsquare";
import ErrorLayout from "next-common/components/layout/errorLayout";

export default function NewsLayout({ children }) {
  const isLoggedIn = useIsLoggedIn();
  const { ensureLogin } = useEnsureLogin();
  const isAdmin = useIsAdmin();

  return (
    <>
      <div className="bg-neutral100 w-screen h-screen overflow-auto">
        <main className="max-w-7xl flex flex-col min-h-full mx-auto bg-neutral100 p-4 space-y-4 text-textPrimary">
          <header className="py-2 space-y-1 flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-bold">
              <Link href="/">SubSquare News Management</Link>
            </h1>
            {isLoggedIn ? (
              <HeaderAccount />
            ) : (
              <PrimaryButton onClick={ensureLogin}>log in</PrimaryButton>
            )}
          </header>
          {isAdmin ? (
            <div className="flex-1 ">{isLoggedIn ? children : null}</div>
          ) : (
            <ErrorLayout
              className="h-full flex-1"
              icon={
                <>
                  <ImgNotMemberLight className="dark:hidden" />
                  <ImgNotMemberDark className="hidden dark:block" />
                </>
              }
              title="403 Forbidden"
              description="You don't have permission to view this page"
            />
          )}
        </main>
      </div>
      <Toast />
      <CookiesConsent />
      <LoginGlobalPopup />
    </>
  );
}
