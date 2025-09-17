import {
  EmptyTd,
  StyledTable,
  StyledTd,
  StyledTr,
} from "next-common/components/styled/table";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import Popup from "../popup/wrapper/Popup";
import ErrorMessage from "next-common/components/styled/errorMessage";
import { useCallback, useState } from "react";
import DangerButton from "next-common/lib/button/danger";
import { Fragment } from "react";
import Loading from "../loading";
import Button from "next-common/lib/button";
import { useDispatch } from "react-redux";
import {
  newSuccessToast,
  newErrorToast,
  newPendingToast,
  removeToast,
} from "next-common/store/reducers/toastSlice";
import NewsLayout from "./layout";
import { cn } from "next-common/utils";
import AddNewsPopup from "./addNews";
import EditPopup from "./editPopup";

const initialItems = [
  {
    id: 1,
    title: "Kusama Parachain Auction #111",
    link: "https://polkadot.subsquare.io/referenda/1751?tab=votes_bubble",
    proposer: "opensquare123456",
  },
  {
    id: 2,
    title: "DOT tokens were unlocked from Polkadot Crowdloans on October 24",
    link: "https://polkadot.subsquare.io/referenda/1751?tab=votes_bubble",
    proposer: "opensquare123456",
  },
  {
    id: 3,
    title:
      "Five New Parachains, Staking Growth & Technical Upgrades as Expansion Continues",
    link: "https://polkadot.subsquare.io/referenda/1751?tab=votes_bubble",
    proposer: "opensquare123456",
  },
  {
    id: 4,
    title: "This is an event title",
    link: "https://polkadot.subsquare.io/referenda/1751?tab=votes_bubble",
    proposer: "opensquare123456",
  },
];

export default function NewsManagementPage() {
  const dispatch = useDispatch();
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const moveNews = useCallback(
    (fromIndex, toIndex) => {
      if (toIndex < 0 || toIndex >= items.length) return;

      setLoading(true);
      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      setItems(newItems);
      setLoading(false);
      dispatch(newSuccessToast("News order updated!"));
    },
    [items, dispatch],
  );

  const saveChanges = useCallback(() => {
    setLoading(true);
    const toastId = Date.now();

    dispatch(newPendingToast(toastId, "Saving changes..."));

    // moke aip
    setTimeout(() => {
      setLoading(false);
      dispatch(removeToast(toastId));
      dispatch(newSuccessToast("All changes saved successfully!"));
    }, 2000);
  }, [dispatch]);

  const [popupData, setPopupData] = useState(null);

  return (
    <NewsLayout>
      <div>
        <div className="flex flex-wrap gap-4 text-xs text-neutral500 mt-2">
          <span>Total: {items.length}</span>
        </div>

        <div className="overflow-x-auto">
          <StyledTable>
            <tbody>
              {items?.length > 0 ? (
                items.map((item, index) => (
                  <Fragment key={item.id}>
                    <StyledTr>
                      <StyledTd style={{ textAlign: "left", width: 80 }}>
                        <div className="flex items-center gap-2">
                          #{index + 1}
                        </div>
                      </StyledTd>
                      <StyledTd onMouseDown={(e) => e.stopPropagation()}>
                        <div className="max-w-md">
                          <div className="font-medium text-sm">
                            {item.title}
                          </div>
                          <div className="text-xs text-neutral500 mt-1">
                            Created:{" "}
                            {new Date(item.createdAt).toLocaleDateString()}
                            {item.updatedAt && (
                              <span>
                                {" "}
                                • Updated:{" "}
                                {new Date(item.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </StyledTd>
                      <StyledTd onMouseDown={(e) => e.stopPropagation()}>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-theme500 hover:text-theme600 text-sm break-all"
                        >
                          {item.link}
                        </a>
                      </StyledTd>
                      <StyledTd
                        style={{ textAlign: "center", width: 200 }}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="small"
                            className={cn(
                              "text-theme500 px-2 py-1",
                              index === 0 && "text-theme300 cursor-no-drop",
                            )}
                            disabled={index === 0}
                            onClick={() => moveNews(index, index - 1)}
                          >
                            ↑
                          </Button>
                          <Button
                            size="small"
                            className={cn(
                              "text-theme500 px-2 py-1",
                              index === items.length - 1 &&
                                "text-theme300 cursor-no-drop",
                            )}
                            disabled={index === items.length - 1}
                            onClick={() => moveNews(index, index + 1)}
                          >
                            ↓
                          </Button>
                          <Button
                            size="small"
                            className="text-blue-500 px-2 py-1"
                            onClick={() => setPopupData(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            className="text-red-500 px-2 py-1"
                            onClick={() => setDeleteIndex(index)}
                          >
                            Delete
                          </Button>
                        </div>
                      </StyledTd>
                    </StyledTr>
                  </Fragment>
                ))
              ) : (
                <StyledTr>
                  <EmptyTd colSpan="5">
                    {loading ? <Loading size={16} /> : "No news items found"}
                  </EmptyTd>
                </StyledTr>
              )}
            </tbody>
          </StyledTable>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            className="bg-theme500 text-textPrimaryContrast w-full sm:w-auto"
            onClick={saveChanges}
            loading={loading}
          >
            Save All Changes
          </Button>
          <AddNewsPopup />
        </div>

        {deleteIndex !== null && (
          <DeletePopup
            item={items[deleteIndex]}
            onConfirm={() => {}}
            onClose={() => setDeleteIndex(null)}
          />
        )}

        {popupData && (
          <EditPopup
            title="Edit"
            data={popupData}
            onClose={() => {
              setPopupData(null);
            }}
            onConfirm={() => {}}
          />
        )}
      </div>
    </NewsLayout>
  );
}

function DeletePopup({ onConfirm, onClose }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      dispatch(newErrorToast("Failed to delete news item. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, [onConfirm, dispatch]);

  return (
    <Popup title="Delete News Item" onClose={onClose}>
      <div className="space-y-4">
        <ErrorMessage>
          Are you sure you would like to delete this news item?
        </ErrorMessage>
      </div>
      <PopupButtonWrapper className="space-x-2">
        <DangerButton onClick={handleDelete} loading={isLoading}>
          Delete
        </DangerButton>
        <Button
          className="border border-neutral400"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </PopupButtonWrapper>
    </Popup>
  );
}
