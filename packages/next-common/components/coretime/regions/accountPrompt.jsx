import { useMemo } from "react";
import pluralize from "pluralize";
import Link from "next-common/components/link";
import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { useUser } from "next-common/context/user";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { isSameAddress } from "next-common/utils";
import useRegions from "./useRegions";
import { RegionStatus } from "./utils";

export default function CoretimeRegionsAccountPrompt() {
  const user = useUser();
  const { regions, loading } = useRegions();
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.coretimeRegionsPromptVisible,
    true,
  );

  const ownedRegionCount = useMemo(
    () =>
      regions.filter(
        (region) =>
          region.status !== RegionStatus.Expired &&
          isSameAddress(region.owner, user?.address),
      ).length,
    [regions, user?.address],
  );

  if (loading || !visible || ownedRegionCount === 0) {
    return null;
  }

  return (
    <ScrollPromptItemWrapper
      prompt={{
        key: CACHE_KEY.coretimeRegionsPromptVisible,
        message: (
          <div>
            Currently there {pluralize("is", ownedRegionCount)}{" "}
            {ownedRegionCount} {pluralize("region", ownedRegionCount)},{" "}
            <Link className="underline" href="/coretime/regions">
              here
            </Link>
          </div>
        ),
        type: PromptTypes.INFO,
        close: () => setVisible(false, { expires: 15 }),
      }}
    />
  );
}
