import { ActionFunctionArgs, json } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { StandardErrorBoundary } from "~/components/standard-error-boundary";
import { Text } from "~/components/text";
import { useUser } from "~/utils";

import { getUserById } from "./user.server";

export const loader = async ({context, params }: ActionFunctionArgs) => {
  const userId = params.userId;
  const user = await getUserById(context.db, userId ?? "");
  return json({ user });
};

export default function UserProfile() {
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col gap-4">
      <div className="flex justify-end gap-4">

          <Link
            to="edit?update=profile"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 active:bg-blue-400 focus:bg-blue-700 disabled:bg-gray-400"
          >
            Edit Profile
          </Link>

          <Link
            to="edit?update=password"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 active:bg-blue-400 focus:bg-blue-700 disabled:bg-gray-400"
          >
            Change Password
          </Link>

      </div>

      <h2 className="text-xl font-bold py-4">Basic User Info</h2>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email ?? "Unknown"}</Text>
      <Text>Phone: {user.phoneNumber ?? "Unknown"}</Text>
      {user.createdDate ? (
        <Text>
          Created:{" "}
          {new Date(user.createdDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      ) : null}
      {user.updatedDate ? (
        <Text>
          Created:{" "}
          {new Date(user.updatedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  return <StandardErrorBoundary/>
}
