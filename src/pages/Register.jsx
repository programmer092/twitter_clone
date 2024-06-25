import { useState } from "react";
import { Link } from "react-router-dom";
import useRegister from "../hooks/useRegister";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const { register } = useRegister();

  const handleClick = async (e) => {
    e.preventDefault();
    if (name.trim() === "" && email.trim() === "" && password.trim() === "") {
      return toast.error("All fields are required");
    }
    if (name.length < 4 || name.trim() === "" || name.trim().length < 4) {
      return toast.error("Name should be atleast 4 characters long");
    } else if (
      (password.length < 6 || password.trim() === "") &&
      name.trim() !== "" &&
      email.trim() !== ""
    ) {
      return toast.error("Password should be atleast 6 characters long");
    } else if (
      name.trim() !== "" &&
      email.trim() === "" &&
      password.trim() === ""
    ) {
      return toast.error("Email and Password are required");
    } else if (
      email.trim() === "" &&
      password.trim() !== "" &&
      name.trim() !== ""
    ) {
      return toast.error("Email is required");
    } else {
      await register(name, email, password);
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
            Register Now!
          </h1>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label className="block text-sm font-medium leading-6 text-black">
                Name
              </label>
              <div className="mt-2">
                <input
                  value={name}
                  type="text"
                  onChange={(e) => setname(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-black">
                Email address
              </label>
              <div className="mt-2">
                <input
                  value={email}
                  type="email"
                  onChange={(e) => setemail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-black">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  value={password}
                  type="password"
                  onChange={(e) => setpassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                onClick={handleClick}
                className="flex w-full justify-center rounded-md bg-indigo-600 p-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="pt-2">
            Do not have Account ?{" "}
            <Link to="/">
              <span className="text-blue-600">Login Now!</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
