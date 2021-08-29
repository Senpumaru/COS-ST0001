import React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

function Users() {
  const { isLoading, error, data, isFetching } = useQuery("repoData", () =>
    fetch("https://api.github.com/repos/tannerlinsley/react-query").then((res) => res.json())
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <React.Fragment>
      <div>Users</div>
      <div>{isFetching ? "Updating..." : ""}</div>
    </React.Fragment>
  );
}

export default Users;
