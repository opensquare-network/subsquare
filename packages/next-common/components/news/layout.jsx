import { useState } from "react";
import Toast from "../toast";
import Button from "next-common/lib/button";

export default function NewsLayout({ children }) {
  const [user, setUser] = useState("opensquare123456");
  return (
    <>
      <main className="max-w-7xl mx-auto bg-neutral100 p-4 sm:p-8 space-y-4">
        <header className="py-3 space-y-1">
          <h1 className="text-lg sm:text-xl font-bold">
            SubSquare News Management
          </h1>
          <div className="flex gap-2 items-center">
            {user && <p className="text-sm text-neutral600">Admin: {user}</p>}
            {user ? (
              <Button
                size="small"
                className="text-red-500 px-2 py-1"
                onClick={() => setUser("")}
              >
                log out
              </Button>
            ) : (
              <Button
                size="small"
                className="text-blue-500 px-2 py-1"
                onClick={() => setUser("opensquare123456")}
              >
                log in
              </Button>
            )}
          </div>
        </header>
        {children}
      </main>
      <Toast />
    </>
  );
}
