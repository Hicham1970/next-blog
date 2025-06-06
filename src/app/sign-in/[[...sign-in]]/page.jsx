"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import  CreatePost  from "@/app/components/CreatePost";

export default function SignInPage() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="flex items-center justify-center text-center font-semibold text-2xl  text-red-500">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-2 md:mx-0 max-w-md w-full",
            formFieldInput:
              "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500",
            card: "shadow-xl",
          },
        }}
      />

      {isSignedIn && user.publicMetadata.isAdmin && (
        // si user is signed and isAdmin then show the create-post page
        <CreatePost />
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
