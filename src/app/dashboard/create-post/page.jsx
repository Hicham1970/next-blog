"use client";

import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import SignInPage from "@/app/sign-in/[[...sign-in]]/page";
// import { ReturnDocument } from "mongodb";

export default function CreatePostPage() {
  const { theme, setTheme } = useTheme();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
  }

  // si user is not signed in ou is not admin then redirect to sign-in page
  if (!isSignedIn || !user.publicMetadata.isAdmin) {
    if (!isSignedIn) {
      return <SignInPage />;
    } else {
      return (
        <div className="flex items-center justify-center text-center font-semibold text-2xl text-red-500">
          You are not authorized to create a post. Please contact the admin.
        </div>
      );
    }
  }

  // à partir d'ici, l'utilisateur est connecté et est admin, vous pouvez afficher le contenu de la page de création de post
}
