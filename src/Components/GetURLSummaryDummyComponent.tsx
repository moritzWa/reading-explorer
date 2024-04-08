import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

function DummyComponent() {
    const [url, setUrl] = useState('');
    const { data, isLoading, error, refetch } = trpc.summarizeUrl.useQuery({ url }, { enabled: false });

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
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </label>
                <button type="submit">Get summary</button>
            </form>

            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error.message}</div>
            ) : (
                <div style={{ width: "100%", overflow: "hidden" }}>
                    API reply: {data?.data.summary}
                </div>
            )}
        </div>
    )
}

export default DummyComponent;