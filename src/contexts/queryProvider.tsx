"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// "use client"

// import { ReactNode, useState } from "react"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// // NEVER DO THIS:
// // const queryClient = new QueryClient()
// //
// // Creating the queryClient at the file root level makes the cache shared
// // between all requests and means _all_ data gets passed to _all_ users.
// // Besides being bad for performance, this also leaks any sensitive data.

// export default function QueryProvider({ children }: { children: ReactNode }) {
//   // Instead do this, which ensures each request has its own cache:
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             // With SSR, we usually want to set some default staleTime
//             // above 0 to avoid refetching immediately on the client
//             staleTime: 60 * 1000,
//             retry: 3,
//           },
//         },
//       })
//   )

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   )
// }
