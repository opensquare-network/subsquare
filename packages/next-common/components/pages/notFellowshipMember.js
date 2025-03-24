import { useRouter } from "next/router";
import { ImgNotMemberLight, ImgNotMemberDark } from "@osn/icons/subsquare";
import BaseLayout from "next-common/components/layout/baseLayout";
import SecondaryButton from "next-common/lib/button/secondary";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import { upperFirst } from "lodash-es";

function ImgNotMember() {
  return (
    <>
      <ImgNotMemberLight className="dark:hidden" />
      <ImgNotMemberDark className="hidden dark:block" />
    </>
  );
}

export default function NotFellowshipMember() {
  const router = useRouter();
  const section = useCollectivesSection();

  return (
    <BaseLayout>
      <div className="flex items-center justify-center grow px-[16px]">
        <div className="flex flex-col items-center gap-[24px]">
          <ImgNotMember />
          <div className="flex flex-col gap-[8px] items-center">
            <h1 className="text-textPrimary text20Bold">
              Not a {upperFirst(section)} member
            </h1>
            <h2 className="text-center text-textTertiary text14Medium">
              You are currently visiting an account that is not a {section}{" "}
              member yet
            </h2>
          </div>
          <SecondaryButton onClick={() => router.push(`/${section}/members`)}>
            Check All Members
          </SecondaryButton>
        </div>
      </div>
    </BaseLayout>
  );
}
