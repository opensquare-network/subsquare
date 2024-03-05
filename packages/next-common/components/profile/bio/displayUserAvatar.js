import Avatar from "next-common/components/avatar";
import Gravatar from "next-common/components/gravatar";

export default function DisplayUserAvatar({ address, user }) {
  return address ? (
    <Avatar address={address} size={48} />
  ) : (
    <Gravatar emailMd5={user?.emailMd5} size={48} />
  );
}
