import { DataForSEOBacklinkItem } from "@/trpc/types";

function Article({ item, key }: { item: DataForSEOBacklinkItem; key: number }) {
  return (
    <div key={key} className="p-8">
      <a href={item.url_from} target="_blank" rel="noopener noreferrer">
        {item.page_from_title}
        {item.url_from}
      </a>
    </div>
  );
}

export default Article;
