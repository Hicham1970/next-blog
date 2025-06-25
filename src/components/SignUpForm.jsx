'use client'; 
import InputCompo from './InputCompo';
import Link from 'next/link'; 

const SignUpForm = () => {
    return (
      <section className="container ">
        <form className="border-2  border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5 ">
          <h2 className="text-center special-word">Sign Up</h2>
          <InputCompo label="Name" type="text" name="name" />
          <InputCompo label="Email" type="text" name="email" />
          <InputCompo label="Password" type="password" name="password" />
          <button type="submit" className="btn w-full">
            Sign Up
          </button>
          <p className="text-center">
            Already have an account? {""}
            <Link
              href="/login"
              className="text-center text-primaryColorLight hover:text-primaryColor dark:text-primaryColor
              dark:hover:text-white"
            >
              Login
            </Link>
          </p>
        </form>
      </section>
    );
  
    
}
export default SignUpForm