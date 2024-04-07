import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

function DummyComponent() {
    const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Climate_change');
    const getForwardLinks = trpc.getForwardLinks.useQuery({ url }, {
        enabled: url.length > 0
    });

    return (
        <div style={{ width: "100%", overflow: "hidden" }}>
            API reply:
            <ul>
                {getForwardLinks.data?.data.map((link, index) => {
                    return (
                        <li key={index}>
                            <a href={link} key={index}>
                                {link}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default DummyComponent;