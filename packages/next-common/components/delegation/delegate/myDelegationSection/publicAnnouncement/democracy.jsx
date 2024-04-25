import { AvatarContextProvider } from "next-common/context/avatar";
import nextApi from "next-common/services/nextApi";
import { delegationDemocracyDelegatesAddressApi } from "next-common/services/url";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAsync } from "react-use";
import MemberCardListContainer from "../../common/cardListContainer";
import DemocracyDelegateCard from "../../democracy/card";
import Announcement from "./announcement";
import { useSelector } from "react-redux";
import { democracyDelegatesTriggerUpdateSelector } from "next-common/store/reducers/democracy/delegates";
import { SystemLoading } from "@osn/icons/subsquare";

export default function DemocracyAnnouncement() {
  const realAddress = useRealAddress();
  const triggerUpdate = useSelector(democracyDelegatesTriggerUpdateSelector);

  const state = useAsync(async () => {
    return await nextApi
      .fetch(delegationDemocracyDelegatesAddressApi(realAddress))
      .then((resp) => {
        if (resp.result) {
          return resp.result;
        }
      });
  }, [realAddress, triggerUpdate]);

  const addressAvatarMap = new Map([
    [state.value?.address, state.value?.manifesto?.image],
  ]);

  if (state.loading) {
    return (
      <SystemLoading className="my-6 [&_path]:stroke-textTertiary mx-auto" />
    );
  }

  if (state.value) {
    return (
      <AvatarContextProvider addressAvatarMap={addressAvatarMap}>
        <MemberCardListContainer>
          <DemocracyDelegateCard
            delegate={state.value}
            showDelegateButton={false}
          />
        </MemberCardListContainer>
      </AvatarContextProvider>
    );
  }

  return <Announcement />;
}
