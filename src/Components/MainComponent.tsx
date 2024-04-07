import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

function MainComponent() {
  const [link, setLink] = useState("");
  const getBackLinks = trpc.getBackLinks.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await getBackLinks.mutateAsync(link);
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

      {getBackLinks.isLoading ? (
        <div>Loading...</div>
      ) : getBackLinks.error ? (
        <div>Error: {getBackLinks.error.message}</div>
      ) : (
        <div>
          <h2>Backlinks:</h2>
          <ul>
            {getBackLinks.data?.items.map((item: any, index: number) => (
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
}

export default MainComponent;
