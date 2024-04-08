"use client";

import { trpc } from "@/app/_trpc/client";
import {
  DataForSEOBacklinkItem,
  DataForSEOBacklinkResponse,
} from "@/trpc/types";
import Image from "next/image";
import { useState } from "react";
import Article from "./Article";

export const MainComponent = () => {
  const [link, setLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { data, isLoading, error, refetch } = trpc.getBackLinks.useQuery<
    DataForSEOBacklinkResponse[]
  >(link, {
    enabled: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    await refetch();
  };

  console.log("data", data);

  return (
    <div>
      <div className="flex justify-center mb-10">
        <Image src="/dora-logo.svg" alt="Dora Logo" width={200} height={200} />
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input">
          <input
            className="min-w-[300px] text-xl p-8 rounded-full"
            id="input"
            placeholder="Put your article link here"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>
        <button
          className="bg-blue-500 ml-5 text-xl text-white p-8 rounded-full"
          type="submit"
        >
          Get Backlinks
        </button>
      </form>

      {submitted && isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : !data && submitted ? (
        <div>Loading data...</div>
      ) : data && data[0] && data[0].items && data[0].items.length === 0 ? (
        <div>No backlinks found.</div>
      ) : submitted ? (
        <div>
          <h2>Backlinks:</h2>
          <div>
            {data &&
              data[0].items.map(
                (item: DataForSEOBacklinkItem, index: number) => (
                  <Article key={index} item={item} />
                )
              )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
