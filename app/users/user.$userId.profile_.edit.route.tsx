import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData, Form, useLoaderData } from "@remix-run/react";

import { FormTextInput } from "~/components/forms";
import VisuallyHidden from "~/components/visually-hidden";
import { requireUserId } from "~/session.server";

import { createPasswordJSONErrorResponse } from "./user-errors";
import {
  User,
  getUserById,
  updateUser,
  updateUserPassword,
} from "./user.server";
import {
  isUpdatablePasswordErrorResponse,
  isUpdatableUserErrorResponse,
} from "./user.utils";

export const loader = async ({ params, request, context }: ActionFunctionArgs) => {
  const userId = params.userId;
  const url = new URL(request.url);
  const updateParm = url.searchParams.get("update");

  const user = await getUserById(context.db, userId ?? "");
  return json({ user, updateParm });
};

export const action = async ({ request , context}: ActionFunctionArgs) => {
  const requestingUserId = await requireUserId(context.db, request);
  // You can only call request.formData() once per request
  const formData = await request.formData();
  const action = formData.get("action");
  switch (request.method) {
    case "POST": {
      switch (action) {
        case "update-profile": {
          return await handleUpdateUserProfile(formData, requestingUserId);
        }
        case "update-password": {
          return await handleUpdateUserPassword(formData, requestingUserId);
        }
        default:
          throw new Response(`Unsupported action: ${action}`, {
            status: 400,
          });
      }
    }
    default:
      throw new Response(`Unsupported method: ${request.method}`, {
        status: 400,
      });
  }
};

const handleUpdateUserProfile = async (
  formData: FormData,
  requestingUserId: User["id"],
) => {
  const partialUser = {
    username: String(formData.get("username")),
    email: String(formData.get("email")),
    phoneNumber: String(formData.get("phoneNumber")),
    id: String(formData.get("userId")),
  };

  const updatedUser = await updateUser(partialUser, requestingUserId);
  if (isUpdatableUserErrorResponse(updatedUser)) {
    const errors = updatedUser;
    return json(errors, { status: 400 });
  }
  return redirect(`/user/${updatedUser.id}/profile`);
};

const handleUpdateUserPassword = async (
  formData: FormData,
  requestingUserId: User["id"],
) => {
  // You can only update your own password.
  if (requestingUserId !== String(formData.get("userId"))) {
    throw json(createPasswordJSONErrorResponse("global", "User id mismatch"), {status: 400});
  }
  if (formData.get("password") !== formData.get("confirmPassword")) {
    throw json(createPasswordJSONErrorResponse("password","Passwords do not match"), {status: 400});
  }

  const updatedPassword = await updateUserPassword(
    String(formData.get("userId")),
    String(formData.get("password")),
  );
  if (isUpdatablePasswordErrorResponse(updatedPassword)) {
    const errors = updatedPassword;
    return json(errors, { status: 400 });
  }
  return redirect(`/user/${requestingUserId}/profile`);
};

export default function UserProfileEdit() {
  const data = useLoaderData<typeof loader>();
  const { user, updateParm } = data;

  const actionData = useActionData<typeof action>();
  const userErrors = isUpdatableUserErrorResponse(actionData)
    ? actionData?.errors
    : null;
  const passwordErrors = isUpdatablePasswordErrorResponse(actionData)
    ? actionData?.errors
    : null;

  const PasswordUi = (
    <UserProfilesSubmissionFormWrapper
      userId={user?.id}
      action="update-password"
    >
      {passwordErrors ? (
        <div
          className="pt-1 text-red-700"
          id={`${passwordErrors.global}-error`}
        >
          {passwordErrors.global}
        </div>
      ) : (
        <></>
      )}
      <FormTextInput
        label="New Password"
        error={passwordErrors ? passwordErrors?.password : null}
        defaultValue=""
        name="password"
        type="password"
      />
      <FormTextInput
        label="Confirm Password"
        defaultValue=""
        name="confirmPassword"
        type="password"
      />
    </UserProfilesSubmissionFormWrapper>
  );

  const ProfileUi = (
    <UserProfilesSubmissionFormWrapper
      action="update-profile"
      userId={user?.id}
    >
      <FormTextInput
        error={userErrors ? userErrors?.username : null}
        label="Username"
        name="username"
        defaultValue={user?.username ?? ""}
      />
      <FormTextInput
        label="Email"
        name="email"
        defaultValue={user?.email ?? ""}
        error={userErrors?.email}
      />
      <FormTextInput
        label="Phone Number"
        name="phoneNumber"
        type="tel"
        defaultValue={user?.phoneNumber ?? ""}
        error={userErrors?.phoneNumber}
      />
    </UserProfilesSubmissionFormWrapper>
  );

  return updateParm === "password" ? PasswordUi : ProfileUi;
}

const UserProfilesSubmissionFormWrapper = ({
  children,
  action,
  userId,
}: React.PropsWithChildren<{
  action: string;
  userId: string | undefined;
}>) => {
  return (
    <Form method="post" className="flex flex-col gap-4 w-full">
      <div className="flex justify-start flex-col gap-4 md:flex-row-reverse">
        <button
          type="submit"
          className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 active:bg-yellow-400 focus:bg-yellow-400"
        >
          Submit
        </button>
        <button
          onClick={() => history.back()}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 active:bg-blue-400 focus:bg-blue-400"
        >
          Cancel
        </button>
      </div>
      <VisuallyHidden>
        <input readOnly name="userId" value={userId} />
      </VisuallyHidden>
      <VisuallyHidden>
        <input readOnly name="action" value={action} />
      </VisuallyHidden>
      <VisuallyHidden>
        <input readOnly name="redirectTo" value={`/user/${userId}/profile`} />
      </VisuallyHidden>
      {children}
    </Form>
  );
};
