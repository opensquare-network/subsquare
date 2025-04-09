import FellowshipTagInfo from "../fellowshipTagInfo";
import { DisplayUser, DisplayUserAddress } from "../bio";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { cn } from "next-common/utils";
import dynamic from "next/dynamic";
import { VerticalDivider } from "next-common/components/styled/layout/divider";
import { useIsKintsugi } from "next-common/context/chain";

const Relatives = dynamic(
  () => import("next-common/components/profile/relatives"),
  {
    ssr: false,
  },
);

export default function AccountInfoPanel({ address, id }) {
  const isMobile = useIsMobile();
  const shouldAlignCenter = isMobile;
  const isKintsugi = useIsKintsugi();

  return (
    <div
      className={cn(
        "w-full flex px-0 mt-0 gap-4",
        shouldAlignCenter ? "flex-col items-center" : "flex-row items-start",
      )}
    >
      <div
        className={cn(
          "flex mt-0 flex-wrap w-full",
          shouldAlignCenter ? "justify-center" : "justify-start",
          isMobile && "py-2",
        )}
      >
        <DisplayUser
          id={id}
          className={cn(
            "flex text14Medium",
            shouldAlignCenter ? "justify-center" : "",
          )}
        />
        <DisplayUserAddress
          address={address}
          className={cn(
            shouldAlignCenter
              ? "!items-center text-center"
              : "flex-1 !items-start",
          )}
          extra={
            !isMobile && !isKintsugi ? (
              <>
                <VerticalDivider height={13} margin={16} />
                <Relatives />
                <FellowshipTagInfo address={address} />
                <FellowshipTagInfo
                  address={address}
                  pallet="ambassadorCollective"
                  type="ambassador"
                />
              </>
            ) : null
          }
        />
        {isMobile && address && (
          <div className="mt-4 mb-1">
            <Relatives />
            <FellowshipTagInfo address={address} />
            <FellowshipTagInfo
              address={address}
              pallet="ambassadorCollective"
              type="ambassador"
            />
          </div>
        )}
      </div>
    </div>
  );
}
