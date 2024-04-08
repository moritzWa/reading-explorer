import { DataForSEOBacklinkItem } from "@/trpc/types";
import { LinkPreview } from "@dhaiwat10/react-link-preview";

function Article({ item, key }: { item: DataForSEOBacklinkItem; key: number }) {
  return (
    <div key={key}>
      <a href={item.url_from} target="_blank" rel="noopener noreferrer">
        {item.page_from_title}
        {item.url_from}
      </a>
      <LinkPreview url={item.url_from} width="400px" />
    </div>
  );
}

export default Article;
