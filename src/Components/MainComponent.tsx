import { trpc } from "@/app/_trpc/client";

function MainComponent() {
  const getHelloWorldMsg = trpc.getHelloWorld.useQuery();

  const getBackLinks = trpc.getBackLinks.useQuery();

  if (getHelloWorldMsg.isLoading) {
    return <div>Loading...</div>;
  }

  if (getHelloWorldMsg.error) {
    return <div>Error: {getHelloWorldMsg.error.message}</div>;
  }

  console.log(getHelloWorldMsg.data);

  return (
    <div>
      <div>api reply: {getHelloWorldMsg.data?.data}</div>
      <label htmlFor="input">
        Link:
        <input placeholder="put your article link here" />
      </label>
    </div>
  );
}

export default MainComponent;
