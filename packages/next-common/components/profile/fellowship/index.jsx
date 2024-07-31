import ProfileFellowshipMemberInfo from "./memberInfo";
import ProfileFellowshipSections from "./sections";

export default function ProfileFellowship() {
  return (
    <div className="space-y-6">
      <ProfileFellowshipMemberInfo />
      <ProfileFellowshipMemberInfo section="ambassador" />

      <ProfileFellowshipSections />
    </div>
  );
}
