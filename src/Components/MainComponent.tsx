import { trpc } from "@/app/_trpc/client";

function MainComponent() {
  const getHelloWorldMsg = trpc.getHelloWorld.useQuery();

  if (getHelloWorldMsg.isLoading) {
    return <div>Loading...</div>;
  }

  if (getHelloWorldMsg.error) {
    return <div>Error: {getHelloWorldMsg.error.message}</div>;
  }

  console.log(getHelloWorldMsg.data);

  return <div>api reply: {getHelloWorldMsg.data?.data}</div>;
}

export default MainComponent;