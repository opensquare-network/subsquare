import ClosableWarning from "../closeableWarning";

const twoWeeks = 2 * 7 * 24 * 3600 * 1000;

export default function EmailJunkWarning() {
  return (
    <ClosableWarning name="emailJunkWarning" rememberCloseTime={twoWeeks}>
      Please check your SPAM or junk mail folder if you can’t find notification
      mail in your inbox.
    </ClosableWarning>
  );
}
