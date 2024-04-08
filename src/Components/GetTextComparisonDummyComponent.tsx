import { trpc } from "@/app/_trpc/client";

function DummyComponent() {
  const getComparison = trpc.compareTexts.useQuery({
    inputText: "This article talks about the importance of sleep.",
    comparisonText:
      "This article talks about what makes sleep good for the body.",
  });
  return <div>{getComparison.data?.classification}</div>;
}

export default DummyComponent;
