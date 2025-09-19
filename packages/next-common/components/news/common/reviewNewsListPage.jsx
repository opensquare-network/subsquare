import {
  EditButton,
  ApproveButton,
  DeleteButton,
  AddNewsButton,
} from "./buttons";
import { useEcoNewsReviewData } from "./hooks";
import Table from "./table";

export default function ReviewNewsListPage() {
  const {
    items,
    setItems,
    loading,
    refresh: getItems,
  } = useEcoNewsReviewData();

  return (
    <div>
      <div className="overflow-x-auto">
        <Table
          loading={loading}
          dataSource={items}
          columns={[
            {
              title: "Order",
              key: "_id",
              style: { textAlign: "left", width: 80 },
              render(a, b, index) {
                return `#${index + 1}`;
              },
            },
            {
              title: "Title",
              key: "content",
              className: "min-w-[201px]",
            },
            {
              title: "Link",
              key: "link",
              render(link) {
                return link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme500 hover:text-theme600 text-sm break-all"
                  >
                    {link}
                  </a>
                ) : (
                  <span className="text-textTertiary">No link</span>
                );
              },
            },
            {
              title: "Proposer",
              key: "proposer",
            },
            {
              title: "Action",
              className: "w-[180px] px-0",
              render(_, item, index) {
                return (
                  <>
                    <EditButton
                      api={`eco-news/review/${item._id}`}
                      item={item}
                      onConfirm={(data) => {
                        items[index] = data;
                        setItems([...items]);
                        getItems();
                      }}
                    />
                    <ApproveButton
                      item={item}
                      onConfirm={() => {
                        items.splice(index, 1);
                        setItems([...items]);
                        getItems();
                      }}
                    />
                    <DeleteButton
                      api={`eco-news/review/${item._id}`}
                      item={item}
                      onConfirm={() => {
                        items.splice(index, 1);
                        setItems([...items]);
                        getItems();
                      }}
                    />
                  </>
                );
              },
            },
          ]}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <AddNewsButton api="eco-news/review" onConfirm={getItems} />
      </div>
    </div>
  );
}
