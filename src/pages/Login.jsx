import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import useGoogleLogin from "../hooks/useGoogleLogin";
import useFacebookLogin from "../hooks/useFacebookLogin";
import { Auth } from "../firebase/auth";
export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { googleLogin } = useGoogleLogin();
  const { facebooklogin } = useFacebookLogin();
  const { LoginUser } = Auth();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (email.trim() === "" && password.trim() !== "") {
        return toast.error("Email is required");
      } else if (password.trim() === "" && email.trim() !== "") {
        return toast.error("Password is required");
      } else if (email.trim() === "" && password.trim() === "") {
        return toast.error("Email and Password are required");
      }
      await LoginUser(email, password);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogle = async (e) => {
    e.preventDefault();
    await googleLogin();
  };

  const handleFacebook = async (e) => {
    e.preventDefault();
    await facebooklogin();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
            Login Now!
          </h1>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
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
                {/* <div className="text-sm">
                  <p className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </p>
                </div> */}
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
                Sign in
              </button>
            </div>
          </form>
          <h1 className="m-2 flex items-center justify-center text-black">
            OR
          </h1>
          <div
            className="flex items-center justify-center rounded-md bg-blue-600 p-2"
            onClick={handleGoogle}
          >
            <FcGoogle size={25} />
          </div>
          <div
            className="mt-2 flex items-center justify-center rounded-md bg-blue-600 p-2"
            onClick={handleFacebook}
          >
            <BsFacebook size={25} />
          </div>
          <p className="pt-2">
            Do not have Account ?{" "}
            <Link to="/register">
              <span className="text-blue-600">Register Now!</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
