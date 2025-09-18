import {
  EmptyTd,
  StyledTable,
  StyledTd,
  StyledTr,
} from "next-common/components/styled/table";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import Loading from "next-common/components/loading";
import nextApi from "next-common/services/nextApi";
import {
  EditButton,
  ApproveButton,
  DeleteButton,
  AddNewsButton,
} from "./buttons";

export default function ReviewNewsListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getItems = async () => {
    setLoading(true);
    const { result } = await nextApi.fetch("eco-news/review").finally(() => {
      setLoading(false);
    });
    setItems(result);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      <div className="overflow-x-auto">
        <StyledTable>
          <tbody>
            {items?.length > 0 ? (
              items.map((item, index) => (
                <Fragment key={item._id}>
                  <StyledTr>
                    <StyledTd style={{ textAlign: "left", width: 80 }}>
                      <div className="flex items-center gap-2">
                        #{index + 1}
                      </div>
                    </StyledTd>
                    <StyledTd>
                      <div className="max-w-md">
                        <div className="font-medium text-sm">
                          {item.content}
                        </div>
                      </div>
                    </StyledTd>
                    <StyledTd style={{ textAlign: "left" }}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-theme500 hover:text-theme600 text-sm break-all"
                      >
                        {item.link}
                      </a>
                    </StyledTd>
                    <StyledTd style={{ textAlign: "left", width: 80 }}>
                      {item.proposer}
                    </StyledTd>
                    <StyledTd style={{ textAlign: "center", width: 200 }}>
                      <div className="flex gap-1 justify-center">
                        <EditButton
                          api={`eco-news/review/${item._id}`}
                          item={item}
                          onConfirm={getItems}
                        />
                        <ApproveButton item={item} onConfirm={getItems} />
                        <DeleteButton
                          api={`eco-news/review/${item._id}`}
                          item={item}
                          onConfirm={getItems}
                        />
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
        <AddNewsButton api="eco-news/review" onConfirm={getItems} />
      </div>
    </div>
  );
}
