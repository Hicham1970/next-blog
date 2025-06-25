"use client";

import InputCompo from "./InputCompo";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; 

// pour envoyer les données du formulaire à l'API
const initialState = {
  name: "",
  email: "",
  password: "",
};

const LoginForm = () => {
  const [hydrated, setHydrated] = useState(false);

  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null; // Render nothing until the component is hydrated
  }

  const handleChange = (e) => {
    setError("");
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const { email, password } = state;
    // Basic validation
    if (!email || !password) {
      setError("All fields are required!");
      setIsLoading(false);
      return;
    }
    // regular expression pattern for a basic email validation
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email)) {
      setError("Please enter a valid email address!");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password!");
        setIsLoading(false);
        return
      }
      else { 
        setSuccess("Login successful!");
        setTimeout(() => {
          router.push("/blog"); 
        }, 1000); 
      }

      
    } catch (error) {
      console.error("Error during sign up:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container ">
      <form
        onSubmit={handleSubmit}
        className="border-2  border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5 "
      >
        <h2 className="text-center special-word">Login</h2>
        <InputCompo
          label="Email"
          type="text"
          name="email"
          onChange={handleChange}
          value={state.email}
        />
        <InputCompo
          label="Password"
          type="password"
          name="password"
          onChange={handleChange}
          value={state.password}
        />

        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}

        <button type="submit" className="btn w-full">
          {isLoading ? "Loading..." : "Login"}
        </button>
        <p className="text-center">
          You don't have an account? {""}
          <Link
            href="/signup"
            className="text-center text-primaryColorLight hover:text-primaryColor dark:text-primaryColor
                dark:hover:text-white"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </section>
  );
};

export default LoginForm;
