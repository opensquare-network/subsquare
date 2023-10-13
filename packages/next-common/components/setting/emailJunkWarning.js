import { useUser } from "next-common/context/user";
import ClosableWarning from "../closeableWarning";

const twoWeeks = 2 * 7 * 24 * 3600 * 1000;

export default function EmailJunkWarning() {
  const user = useUser();
  return (
    <ClosableWarning
      name={`${user?.username}-emailJunkWarning`}
      rememberCloseTime={twoWeeks}
    >
      Please check your SPAM or junk mail folder if you can’t find notification
      mail in your inbox.
    </ClosableWarning>
  );
}
