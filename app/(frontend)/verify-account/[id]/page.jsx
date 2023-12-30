"use client";

import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import { getData } from "@/lib/getData";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function VerifyAccount() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Time in seconds
  const resendCooldownTime = 60; // 60 seconds cooldown time (adjust as needed)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (cooldown > 0) {
        setCooldown(cooldown - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const resendLink = async () => {
    if (cooldown === 0) {

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      if (!id) return;

      setLoading(true);
      const data = await getData(`users/${id}`)
      if (data) {
        try {
          const res = await fetch(`${baseUrl}/api/users/${id}/email`, {
            method: 'POST',
            'Content-Type': 'application/json',
            body: JSON.stringify({ id })
          })
          if (res.ok) {
            toast.success("Email send successfully")
            setCooldown(resendCooldownTime);
            setLoading(false);
          } else {
            toast.error("Email not sent successfully")
            setLoading(false);
          }
        } catch (error) {
          toast.error(error.message)
          setLoading(false);
        }
    
      }
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Verify Account
            </h1>
            <Alert color="warning" icon={HiInformationCircle}>
              <span className="font-medium">Please Check your Email!</span> We
              have sent you a Verification Link and Click on the Link to Verify
              your Account. Thank you!
            </Alert>
            <div className="my-6">
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 ">
                Did not see it?{" "}
                <button disabled={loading || cooldown !== 0} onClick={resendLink} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                  {loading ? 'Sending...' : `Resend the Link ${cooldown > 0 ? `(${cooldown}s)` : ''}`} 
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
