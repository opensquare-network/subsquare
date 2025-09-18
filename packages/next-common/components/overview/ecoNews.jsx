import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import nextApi from "next-common/services/nextApi";
import Link from "next/link";
import { useState } from "react";
import IconButton from "next-common/components/iconButton";
import { SystemPlus } from "@osn/icons/subsquare";
import EditPopup from "../news/common/editPopup";
import { useDispatch } from "react-redux";
import {
  newSuccessToast,
  newErrorToast,
} from "next-common/store/reducers/toastSlice";
import { useChainSettings } from "next-common/context/chain";
import Loading from "../loading";
import { useEcoNewsData } from "../news/common/hooks";
import NoData from "../noData";

export default function EcoNews() {
  const { ecoNews } = useChainSettings();
  if (!ecoNews) {
    return null;
  }
  return <EcoNewsImpl />;
}

function EcoNewsImpl() {
  const { items, loading } = useEcoNewsData();

  return (
    <div className="md:w-[320px] flex-shrink-0">
      <TitleContainer className="mb-4">
        Eco News
        <AddNews />
      </TitleContainer>
      <div className="p-6 bg-neutral100 shadow-100 border border-neutral300 rounded-xl">
        {loading ? (
          <div className="flex justify-center">
            <Loading />
          </div>
        ) : (
          <NewsList list={items} />
        )}
      </div>
    </div>
  );
}

function NewsList({ list }) {
  if (!list?.length) {
    return <NoData text="No news data" />;
  }
  return (
    <ul className="list-disc text14Medium text-textPrimary space-y-4">
      {list?.map((item, index) => (
        <li key={index}>
          <Link href={item.link} target="_block" className="hover:underline">
            {item.content}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AddNews() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const addNews = async (data) => {
    setLoading(true);
    const { error } = await nextApi
      .post("eco-news/review", data)
      .finally(() => {
        setLoading(false);
      });
    if (!error) {
      setOpen(false);
      dispatch(newSuccessToast("Submit successfully!"));
    } else {
      dispatch(
        newErrorToast(
          error.message || "Failed to submit news. Please try again.",
        ),
      );
    }
  };
  return (
    <>
      <IconButton
        className="text-theme500 bg-theme100 rounded-md"
        onClick={() => setOpen(true)}
      >
        <SystemPlus className="w-6 h-6 p-1" />
      </IconButton>
      {open && (
        <EditPopup
          title="Add News"
          isLoading={loading}
          onConfirm={addNews}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
