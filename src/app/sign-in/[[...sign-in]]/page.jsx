"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import CreatePostPage from "../../dashboard/create-post/page";

export default function SignInPage() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="flex items-center justify-center text-center font-semibold text-2xl  text-red-500">
      <SignIn
      />

      {isSignedIn && user.publicMetadata.isAdmin && (
        // si user is signed and isAdmin then show the create-post page
        <CreatePostPage path="/create-post" />
      )}
      {/* // If the user is signed in but not an admin, you can show a message or redirect them elsewhere */}
      {isSignedIn && !user.publicMetadata.isAdmin && (
        <div className="text-red-500 mt-4">
          Please contact the admin to access the dashboard.
        </div>
      )}
    </div>
  );
}
