import { trpc } from "./_trpc/client";

export default function Home() {
  const getHelloWorldMsg = trpc.getHelloWorld.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      api reply: {getHelloWorldMsg.data}
    </main>
  );
}
