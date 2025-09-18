import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import Popup from "../popup/wrapper/Popup";
import ErrorMessage from "next-common/components/styled/errorMessage";
import { useState } from "react";
import DangerButton from "next-common/lib/button/danger";
import Button from "next-common/lib/button";
import EditPopup from "./editPopup";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import nextApi from "next-common/services/nextApi";
import {
  newSuccessToast,
  newPendingToast,
  removeToast,
  newErrorToast,
} from "next-common/store/reducers/toastSlice";

export function DeleteButton({ onConfirm }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small"
        className="text-red-500 px-2 py-1"
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
      {open && (
        <Popup title="Delete" onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <ErrorMessage>
              Are you sure you want to delete this News?
            </ErrorMessage>
          </div>
          <PopupButtonWrapper className="space-x-2">
            <DangerButton onClick={onConfirm}>Delete</DangerButton>
            <Button
              className="border border-neutral400"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </PopupButtonWrapper>
        </Popup>
      )}
    </>
  );
}

export function EditButton({ item, onConfirm }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small"
        className="text-blue-500 px-2 py-1"
        onClick={() => setOpen(true)}
      >
        Edit
      </Button>
      {open && (
        <EditPopup
          title="Edit"
          data={item}
          onClose={() => {
            setOpen(false);
          }}
          onConfirm={(item) => {
            onConfirm(item);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

export function AddNewsButton({ onConfirm }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        const { result } = await nextApi.post("eco-news", data);
        if (result) {
          setOpen(false);
          onConfirm();
        }
      } catch (error) {
        dispatch(newErrorToast("Failed to add news item. Please try again."));
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, onConfirm],
  );

  return (
    <>
      <Button
        className="border border-neutral400"
        onClick={() => setOpen(true)}
      >
        Add News
      </Button>
      {open && (
        <EditPopup
          isLoading={isLoading}
          title="Add News"
          onClose={() => {
            setOpen(false);
          }}
          onConfirm={(data) => {
            handleSubmit(data);
          }}
        />
      )}
    </>
  );
}

export function SaveButton({ items, onConfirm, disabled }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const saveChanges = useCallback(async () => {
    setLoading(true);
    const toastId = Date.now();

    dispatch(newPendingToast(toastId, "Saving changes..."));

    const { result } = await nextApi
      .post("eco-news/update-all", { ecoNews: items })
      .finally(() => {
        setLoading(false);
        dispatch(removeToast(toastId));
      });
    if (result) {
      dispatch(newSuccessToast("All changes saved successfully!"));
      onConfirm();
    }
  }, [dispatch, items, onConfirm]);
  return (
    <Button
      className="bg-theme500 text-textPrimaryContrast w-full sm:w-auto"
      onClick={saveChanges}
      loading={loading}
      disabled={disabled}
    >
      Save
    </Button>
  );
}
