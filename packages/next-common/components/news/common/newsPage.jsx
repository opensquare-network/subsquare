import {
  EmptyTd,
  StyledTable,
  StyledTd,
  StyledTr,
} from "next-common/components/styled/table";
import { Fragment } from "react";
import Loading from "../../loading";
import {
  EditButton,
  DeleteButton,
  AddNewsButton,
  ToTopButton,
} from "./buttons";
import { useEcoNewsData } from "./hooks";

export default function NewsPage() {
  const { items, loading, refresh: getItems } = useEcoNewsData();

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
                        <ToTopButton
                          items={items}
                          index={index}
                          onConfirm={getItems}
                        />
                        <EditButton
                          api={`eco-news/${item._id}`}
                          item={item}
                          onConfirm={getItems}
                        />
                        <DeleteButton
                          api={`eco-news/${item._id}`}
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
        <AddNewsButton api="eco-news" onConfirm={getItems} />
      </div>
    </div>
  );
}
