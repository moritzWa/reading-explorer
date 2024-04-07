"use client";

import { trpc } from "@/app/_trpc/client";
import { DataForSEOBacklinkResponse } from "@/trpc/types";
import { useState } from "react";

export const MainComponent = () => {
  const [link, setLink] = useState("");
  const { data, isLoading, error, refetch } =
    trpc.getBackLinks.useQuery<DataForSEOBacklinkResponse>(link, {
      enabled: false,
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await refetch();
  };

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
      ) : (
        <div>
          <h2>Backlinks:</h2>
          <ul>
            {data?.items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.url_from}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.domain_from}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
