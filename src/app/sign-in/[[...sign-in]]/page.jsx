"use client";

import { SignIn, useUser, RedirectToSignIn } from "@clerk/nextjs";
import CreatePostPage from "../../dashboard/create-post/page";

export default function SignInPage() {
  const { user, isSignedIn } = useUser();

  if (isSignedIn) {
    if (user.publicMetadata.isAdmin) {
      return <CreatePostPage />;
    } else {
      return (
        <div className="text-red-500 mt-4">
          Please contact the admin to access the dashboard.
        </div>
      );
    }
  }

  return <SignIn />;
}
