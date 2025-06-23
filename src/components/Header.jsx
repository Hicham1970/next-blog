"use client";
import { Button, Navbar, TextInput } from "flowbite-react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export default function Header() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };
  // Ajoutez un useEffect pour vérifier si le thème est bien initialisé
  useEffect(() => {
    console.log("Current theme:", theme);
  }, [theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);
  return (
    <Navbar className="border-b-2 container">
      <Link
        href="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-blue-500 dark:via-purple-600 dark:to-pink-600 rounded-lg text-white">
          Garoum&apos;s
        </span>
        Blog
      </Link>
      
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link href="/">
          <Navbar.Link active={path === "/blog"} as={"div"}>
            Blog
          </Navbar.Link>
        </Link>
        <Link href="/create-blog">
          <Navbar.Link active={path === "/create-blog"} as={"div"}>
            Create
          </Navbar.Link>
        </Link>
        <Link href="/user">
          <Navbar.Link active={path === "/profile"} as={"div"}>
            Profile
          </Navbar.Link>
        </Link>
        <Link href="/login">
          <Navbar.Link active={path === "/login"} as={"div"}>
            Login
          </Navbar.Link>
        </Link>
        <Link href="/signup">
          <Navbar.Link active={path === "/signup"} as={"div"}>
            Signup
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
