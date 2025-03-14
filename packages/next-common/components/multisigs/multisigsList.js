import useWindowSize from "next-common/utils/hooks/useWindowSize";
import DesktopList from "./desktop";
import MobileList from "./mobile";
import { useDispatch, useSelector } from "react-redux";
import { useChain } from "next-common/context/chain";
import { useEffect, useCallback } from "react";
import {
  fetchMyMultisigs,
  myMultisigsSelector,
} from "next-common/store/reducers/multisigSlice";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { ListCard } from "next-common/components/overview/styled";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useCallPopup } from "./context/callPopupContext";

const CallPopup = dynamicPopup(() => import("./callPopup"));

export default function MultisigsList() {
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const chain = useChain();
  const realAddress = useRealAddress();
  const myMultisigs = useSelector(myMultisigsSelector);
  const { items: multisigs = [], pageSize = 15, total = 0 } = myMultisigs || {};
  const isLoading = myMultisigs === null;
  const { page, component: pageComponent } = usePaginationComponent(
    total,
    pageSize,
  );
  const { showPopup, callPopupData, setShowPopup } = useCallPopup();

  const fetchMyMultisigsData = useCallback(() => {
    if (realAddress) {
      dispatch(fetchMyMultisigs(chain, realAddress, page));
    }
  }, [dispatch, chain, realAddress, page]);

  useEffect(() => {
    fetchMyMultisigsData();
  }, [fetchMyMultisigsData]);

  return (
    <ListCard>
      {width > 1024 ? (
        <DesktopList multisigs={multisigs} isLoading={isLoading} />
      ) : (
        <MobileList multisigs={multisigs} isLoading={isLoading} />
      )}
      {pageComponent}
      {showPopup && (
        <CallPopup
          call={callPopupData?.call}
          callHex={callPopupData?.callHex}
          blockHeight={callPopupData?.blockHeight}
          setShow={setShowPopup}
        />
      )}
    </ListCard>
  );
}
