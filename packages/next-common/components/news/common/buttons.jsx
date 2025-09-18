import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import Popup from "next-common/components/popup/wrapper/Popup";
import ErrorMessage from "next-common/components/styled/errorMessage";
import { StatusWrapper } from "next-common/components/popup/styled";
import { useState } from "react";
import DangerButton from "next-common/lib/button/danger";
import PrimaryButton from "next-common/lib/button/primary";
import Button from "next-common/lib/button";
import EditPopup from "./editPopup";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import nextApi from "next-common/services/nextApi";
import {
  newSuccessToast,
  newErrorToast,
} from "next-common/store/reducers/toastSlice";
import { cn } from "next-common/utils";
import * as Popover from "@radix-ui/react-popover";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";

export function DeleteButton({ api, onConfirm }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    const { error } = await nextApi.delete(api).finally(() => {
      setLoading(false);
    });
    if (!error) {
      onConfirm();
      setOpen(false);
      dispatch(newSuccessToast("Delete successfully!"));
    } else {
      dispatch(
        newErrorToast(
          error.message || "Failed to delete item. Please try again.",
        ),
      );
    }
  };

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
            <DangerButton loading={loading} onClick={onDelete}>
              Delete
            </DangerButton>
            <Button
              className="border border-neutral400 text-textPrimary"
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

export function ApproveButton({ item, onConfirm }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    const { error } = await nextApi
      .post(`eco-news/review/${item._id}/approve`)
      .finally(() => {
        setLoading(false);
      });
    if (!error) {
      onConfirm();
      setOpen(false);
      dispatch(newSuccessToast("Approve successfully!"));
    } else {
      dispatch(
        newErrorToast(
          error.message || "Failed to approve item. Please try again.",
        ),
      );
    }
  };

  return (
    <>
      <Button
        size="small"
        className="text-blue-500 px-2 py-1"
        onClick={() => setOpen(true)}
      >
        Approve
      </Button>
      {open && (
        <Popup title="Approve" onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <StatusWrapper className="bg-blue-100 !text-blue-500">
              Are you sure you want to approve this News?
            </StatusWrapper>
          </div>
          <PopupButtonWrapper className="space-x-2">
            <PrimaryButton loading={loading} onClick={onDelete}>
              Approve
            </PrimaryButton>
            <Button
              className="border border-neutral400 text-textPrimary"
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

export function EditButton({ api, item, onConfirm }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const onSave = async (data) => {
    setLoading(true);
    const { error } = await nextApi.patch(api, data).finally(() => {
      setLoading(false);
    });
    if (!error) {
      onConfirm();
      setOpen(false);
      dispatch(newSuccessToast("Edit changes saved successfully!"));
    } else {
      dispatch(
        newErrorToast(
          error.message || "Failed to edit news item. Please try again.",
        ),
      );
    }
  };
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
          isLoading={loading}
          title="Edit"
          data={item}
          onClose={() => {
            setOpen(false);
          }}
          onConfirm={onSave}
        />
      )}
    </>
  );
}

export function AddNewsButton({ api, onConfirm }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        const { result } = await nextApi.post(api, data);
        if (result) {
          setOpen(false);
          onConfirm();
          dispatch(newSuccessToast("Add news successfully!"));
        }
      } catch (error) {
        dispatch(newErrorToast("Failed to add news item. Please try again."));
      } finally {
        setIsLoading(false);
      }
    },
    [api, dispatch, onConfirm],
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

export function ToTopButton({ items, index, onConfirm }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getSortItem = () => {
    const newsList = [...items];
    const firstNews = newsList.splice(index, 1);
    return [...firstNews, ...newsList].map(({ _id }) => _id);
  };

  const onMove = async () => {
    setLoading(true);
    const { error } = await nextApi
      .post("eco-news/resort", getSortItem())
      .finally(() => {
        setLoading(false);
      });

    if (error) {
      dispatch(
        newErrorToast(error.message || "Failed to top. Please try again."),
      );
    } else {
      setOpen(false);
      onConfirm();
      dispatch(newSuccessToast("Move news to top successfully!"));
    }
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(state) => {
        !loading && setOpen(state);
      }}
    >
      <Popover.Trigger>
        <Button
          disabled={index === 0}
          size="small"
          className={cn(
            "text-theme500 px-2 py-1",
            index === 0 && "text-theme300 cursor-no-drop",
          )}
          variant="soft"
        >
          Top
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="top" align="center">
          <NeutralPanel className="p-4 w-[200px] text-textPrimary">
            <p className=" text-[14px]">Move item to top ?</p>
            <div className="flex justify-end gap-1 pt-4">
              <PrimaryButton
                size="small"
                loading={loading}
                className="border border-neutral400"
                onClick={onMove}
              >
                Move
              </PrimaryButton>
              <Popover.Close aria-label="Close" asChild>
                <Button size="small" className="border border-neutral400">
                  Cancel
                </Button>
              </Popover.Close>
            </div>
          </NeutralPanel>
          <Popover.Arrow className=" fill-neutral100 shadow shadow-shadow100" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
