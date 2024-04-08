"use client";

import { trpc } from "@/app/_trpc/client";
import { LinkWithSummary } from "@/trpc";
import Image from "next/image";
import { useState } from "react";
import Article from "./Article";

export const MainComponent = () => {
  const [link, setLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { data, isLoading, error, refetch } = trpc.getAllLinks.useQuery<
    LinkWithSummary[]
  >(link, {
    enabled: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    await refetch();
  };

  console.log("data", data);

  const dummyArticle = {
    url_from: "remnote.com",
    page_from_title: "RemNote",
  };

  return (
    <div>
      <div className="flex justify-center mb-10">
        <Image src="/dora-logo.svg" alt="Dora Logo" width={200} height={100} />
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input">
          <input
            className="min-w-[300px] text-xl py-4 px-8 rounded-full"
            id="input"
            placeholder="Put your article link here"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>
        <button
          className="bg-blue-500 ml-5 text-xl text-white py-4 px-8 rounded-full cursor-pointer"
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
      ) : data && data.length === 0 ? (
        <div>No backlinks found.</div>
      ) : submitted ? (
        <div>
          {data &&
            data.map((item: LinkWithSummary, index: number) => (
              <Article key={index} item={item} />
            ))}
        </div>
      ) : null}
    </div>
  );
};
