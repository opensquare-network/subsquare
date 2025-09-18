import {
  EmptyTd,
  StyledTable,
  StyledTd,
  StyledTr,
} from "next-common/components/styled/table";
import { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import Loading from "../loading";
import Button from "next-common/lib/button";
import NewsLayout from "./layout";
import { cn } from "next-common/utils";
import nextApi from "next-common/services/nextApi";
import { EditButton, DeleteButton, AddNewsButton, SaveButton } from "./buttons";

export default function NewsManagementPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getItems = async () => {
    setLoading(true);
    const { result } = await nextApi.fetch("eco-news").finally(() => {
      setLoading(false);
    });
    setItems(result);
  };

  useEffect(() => {
    getItems();
  }, []);

  const moveNews = useCallback(
    (fromIndex, toIndex) => {
      if (toIndex < 0 || toIndex >= items.length) return;
      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      setItems(newItems);
    },
    [items],
  );

  return (
    <NewsLayout>
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
                      <StyledTd onMouseDown={(e) => e.stopPropagation()}>
                        <div className="max-w-md">
                          <div className="font-medium text-sm">
                            {item.content}
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
                          <EditButton
                            item={item}
                            onConfirm={(data) => {
                              items[index] = data;
                              setItems([...items]);
                            }}
                          />
                          <DeleteButton
                            onConfirm={() => {
                              items.splice(index, 1);
                              setItems([...items]);
                            }}
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
          <SaveButton items={items} onConfirm={getItems} disabled={loading} />
          <AddNewsButton onConfirm={getItems} />
        </div>
      </div>
    </NewsLayout>
  );
}
