import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/casos-de-uso")({
  component: () => <Outlet />,
});
