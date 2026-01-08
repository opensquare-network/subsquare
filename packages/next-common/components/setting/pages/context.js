import { useUser } from "next-common/context/user";
import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const user = useUser();

  const [isTelegramChannelOn, setIsTelegramChannelOn] = useState(
    user?.activeNotificationChannels?.telegram !== false,
  );
  const [isEmailChannelOn, setIsEmailChannelOn] = useState(
    user?.activeNotificationChannels?.email !== false,
  );

  return (
    <NotificationContext.Provider
      value={{
        isTelegramChannelOn,
        setIsTelegramChannelOn,
        isEmailChannelOn,
        setIsEmailChannelOn,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
