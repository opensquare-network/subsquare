import AddressUser from "next-common/components/user/addressUser";

export default function CommentUser({ address }) {
  //TODO: GOV2_REFERENDUM DVTag display

  return <AddressUser add={address} />;
}
