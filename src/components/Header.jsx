"use client";

import { useState } from "react";
import { Button, Navbar } from "flowbite-react";
import Link from "next/link";
import { FaMoon, FaSun } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from 'next/image';
import { AiOutlineClose } from 'react-icons/ai';

export default function Header() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const isLoggedIn = false; // Remplace par ta logique d'authentification
  const [showDropDown, setShowDropDown] = useState(false);

  const handleShowDropDown = () => { 
    setShowDropDown(prev => true);
  }
  const handleHideDropDown = () => { 
    setShowDropDown(prev => false);
  }
  return (
    <div className="border-b-2 container py-2 h-16 flex items-center justify-between">
      <Navbar fluid rounded className="w-full">
        <Navbar.Brand as={Link} href="/">
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-blue-500 dark:via-purple-600 dark:to-pink-600 rounded-lg text-white">
            Garoum&apos;s
          </span>
          <span className="ml-2 self-center whitespace-nowrap text-2xl sm:text-xl font-semibold dark:text-white">
            Blog
          </span>
        </Navbar.Brand>
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
          <Navbar.Link as={Link} href="/blog" active={path === "/blog"} className="text-lg font-semibold">
            Blog
          </Navbar.Link>
          {isLoggedIn ? (
            <>
              <Navbar.Link

                as={Link}
                href="/create-blog"
                active={path === "/create-blog"}
                className="text-lg font-semibold"
              >
                Create
              </Navbar.Link>
              <div className="relative">
                <Image
                  onClick={handleShowDropDown}
                  src="/img/bird1.jpg"
                  alt="Profile"
                  width={30}
                  height={30}
                  className="rounded-full cursor-pointer"
                />
                {showDropDown && (
                  <div className="absolute top-10 right-0 bg-primaryColorLight rounded-lg shadow-lg p-5">
                    <AiOutlineClose
                      onClick={handleHideDropDown}
                      className="w-full cursor-pointer"
                    />
                    <button onClick={handleHideDropDown}>Logout</button>
                    <Navbar.Link
                      onClick={handleHideDropDown}
                      as={Link}
                      href="/user"
                      active={path === "/user"}

                    >
                      Profile
                    </Navbar.Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Navbar.Link as={Link} href="/login" active={path === "/login" } className="text-lg font-semibold">
                Login
              </Navbar.Link>
              <Navbar.Link as={Link} href="/signup" active={path === "/signup" } className="text-lg font-semibold">
                Signup
              </Navbar.Link>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
