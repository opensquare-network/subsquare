import React, { useEffect, useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import DelegationTabList from "next-common/components/summary/democracyBeenDelegated/beenDelegatedListPopup/delegationTabList";
import DelegationSummary from "next-common/components/summary/democracyBeenDelegated/beenDelegatedListPopup/delegationSummary";
import TrackSelect from "next-common/components/trackSelect";
import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  getGov2BeenDelegatedByAddress,
  getGov2BeenDelegatedListByAddress,
} from "next-common/utils/gov2/gov2ReferendumVote";

export default function BeenDelegatedListPopup({ trackId, setShow }) {
  const api = useApi();
  const realAddress = useRealAddress();
  const [delegations, setDelegations] = useState();
  const [beenDelegatedList, setBeenDelegatedList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(trackId);
  const isMounted = useIsMounted();

  useEffect(() => {
    setDelegations();
    setBeenDelegatedList([]);

    if (!api || !realAddress) {
      return;
    }
    getGov2BeenDelegatedByAddress(api, selectedTrackId, realAddress).then(
      (result) => {
        if (isMounted.current) {
          setDelegations(result);
        }
      }
    );

    setIsLoading(true);
    getGov2BeenDelegatedListByAddress(api, selectedTrackId, realAddress)
      .then((result) => {
        if (isMounted.current) {
          setBeenDelegatedList(result);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, selectedTrackId, realAddress, isMounted]);

  return (
    <Popup title="Been Delegated" onClose={() => setShow(false)}>
      <TrackSelect
        selectedTrack={selectedTrackId}
        setSelectedTrack={setSelectedTrackId}
      />
      <DelegationSummary
        delegations={delegations}
        beenDelegatedList={beenDelegatedList}
      />
      <DelegationTabList
        beenDelegatedList={beenDelegatedList}
        isLoading={isLoading}
      />
    </Popup>
  );
}
