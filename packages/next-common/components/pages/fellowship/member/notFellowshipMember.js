import { useRouter } from "next/router";
import { ImgNotMemberLight } from "@osn/icons/subsquare";
import BaseLayout from "next-common/components/layout/baseLayout";
import SecondaryButton from "next-common/lib/button/secondary";

export default function NotFellowshipMember() {
  const router = useRouter();
  return (
    <BaseLayout>
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-[24px]">
          <ImgNotMemberLight />
          <div className="flex flex-col gap-[8px] items-center">
            <span className="text-textPrimary text20Bold">
              Not a Fellowship member
            </span>
            <span className="text-textTertiary text14Medium">
              You are currently visiting an account that is not a fellowship
              member yet
            </span>
          </div>
          <SecondaryButton onClick={() => router.push("/fellowship/members")}>
            Check All Members
          </SecondaryButton>
        </div>
      </div>
    </BaseLayout>
  );
}
