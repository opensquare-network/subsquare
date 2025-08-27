import IdentityPropList from "next-common/components/people/overview/identity/identityPropList";

export default function DirectIdentity({ identityInfo, isLoading }) {
  return (
    <IdentityPropList
      className="ml-0"
      identityInfo={identityInfo}
      isLoading={isLoading}
    />
  );
}
