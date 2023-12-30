"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { getData } from "../lib/getData";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  async function onSubmit(data) {
    try {
      setLoading(true);
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (loginData?.error) {
        setLoading(false);
        toast.error("Sign-in error: Check your credentials");
      } else {
        // Sign-in was successful
        toast.success("Login Successful");
        reset();
        router.push("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong with your Network");
    }
  }

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const token = searchParams.get('token');
    const userId = searchParams.get('id');
    if (!userId || !token) return;
    
    // verify
    setIsVerifying(true);
    async function verify() {
      const data = await getData(`users/${userId}`)
      if (data) {
        try {
            // update the email verification to true
            const res = await fetch(`${baseUrl}/api/users/verify`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token, id: userId })
            })
            if (res.ok) {
              toast.success("You Account has been Verified")
              setIsVerifying(false);
            } else {
              toast.error("You Account not Verified")
              setIsVerifying(false);
            }
        } catch (error) {
          console.log(error)
          setIsVerifying(false);
        }
      
      }
    }
    verify()
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 " action="#">
      {isVerifying ? (
        <div class="bg-white w-full my-6 rounded shadow-md overflow-hidden">
          <div class="bg-blue-500 text-white px-4 py-2">
              <span class="text-lg font-bold">Verification</span>
          </div>
          <div class="p-4">
              <div class="flex items-center justify-center">
                  <svg class="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V2.3a9.96 9.96 0 00-4 19.37v-1.5A8 8 0 014 12zm13.8-5.2a9.96 9.96 0 000 10.4v1.5a8 8 0 010-13.4v1.5z">
                      </path>
                  </svg>
              </div>
              <h2 class="text-xl text-center font-bold mt-2">Verifying...</h2>
              <p class="text-gray-600 mt-2 text-center">Please wait while we verify your account.</p>
          </div>
        </div>
      ) : (
          <>
            <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              required=""
            />
            {errors.email && (
              <small className="text-red-600 text-sm ">
                This field is required
              </small>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required=""
            />
            {errors.password && (
              <small className="text-red-600 text-sm ">
                This field is required
              </small>
            )}
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/forgot-password"
              className="shrink-0 font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Forgot Password
            </Link>
            {loading ? (
              <button
                disabled
                type="button"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Signing you in please wait...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login
              </button>
            )}
          </div>
          <div className="flex items-center">
            <div className="w-full bg-slate-500 h-[1px]"></div>
            <span className="mx-2">or</span>
            <div className="w-full bg-slate-500 h-[1px]"></div>
          </div>
          <div className="">
            <button
              type="button"
              className="w-full text-slate-950 bg-white hover:bg-slate-50 focus:ring-4 focus:outline-none focus:ring-slate-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center justify-center flex items-center dark:focus:ring-slate-100 me-2 mb-4 border border-slate-200"
              onClick={() => signIn("google")}
            >
              <FaGoogle className="mr-2 text-red-600 w-4 h-4" />
              Sign in with Google
            </button>
            <button
              onClick={() => signIn("github")}
              type="button"
              className="w-full justify-center text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
            >
              {/* Icon */}
              <FaGithub className="mr-2 w-4 h-4" />
              Sign in with Github
            </button>
          </div>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Sign Up
            </Link>
          </p>
        </>
      )}
      
    </form>
  );
}
