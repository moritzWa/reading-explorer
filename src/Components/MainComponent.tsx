"use client";

import { trpc } from "@/app/_trpc/client";
import {
  DataForSEOBacklinkItem,
  DataForSEOBacklinkResponse,
} from "@/trpc/types";
import { useState } from "react";

export const MainComponent = () => {
  const [link, setLink] = useState("");
  const { data, isLoading, error, refetch } = trpc.getBackLinks.useQuery<
    DataForSEOBacklinkResponse[]
  >(link, {
    enabled: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await refetch();
  };

  console.log("data", data);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input">
          Link:
          <input
            id="input"
            placeholder="Put your article link here"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>
        <button type="submit">Get Backlinks</button>
      </form>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : !data ? (
        <div>Loading data...</div>
      ) : data && data[0].items && data[0].items.length === 0 ? (
        <div>No backlinks found.</div>
      ) : (
        <div>
          <h2>Backlinks:</h2>
          <ul>
            {data &&
              data[0].items.map(
                (item: DataForSEOBacklinkItem, index: number) => (
                  <li key={index}>
                    <a
                      href={item.url_from}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.page_from_title}
                    </a>
                  </li>
                )
              )}
          </ul>
        </div>
      )}
    </div>
  );
};
