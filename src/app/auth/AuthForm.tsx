import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthSchema } from "@/schemas/authSchema";
import { countries } from "../utils/countries-static";
import toast from "react-hot-toast";
import { useState } from "react";

const geminiButton =
  "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800";

export default function AuthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      toast.success("OTP sent!");
    }, 1000);
  };

  const handleOtpSubmit = () => {
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      if (otp === "123456") {
        toast.success("OTP verified! Logging in...");
        localStorage.setItem("auth_token", "dummy_token");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        toast.error("Invalid OTP, please try again.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto p-8 rounded-2xl bg-[#161621]/90 shadow-2xl border border-[#262638] backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-8 tracking-tight">
          Sign in to Gemini
        </h2>

        {/* Show ONLY phone/country fields if OTP not sent */}
        {!otpSent && (
          <>
            <div className="mb-6">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Country
              </label>
              <select
                id="country"
                {...register("country")}
                className="w-full px-4 py-2 rounded-xl bg-[#232334] text-white border border-[#2e2e41] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/30 outline-none transition-all duration-200"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
              {errors.country && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.country.message}
                </span>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                maxLength={15}
                autoComplete="tel"
                {...register("phone")}
                className="w-full px-4 py-2 rounded-xl bg-[#232334] text-white border border-[#2e2e41] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/30 outline-none transition-all duration-200"
              />
              {errors.phone && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.phone.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 mb-2 rounded-xl text-white font-semibold shadow-lg transition-all duration-150 ${geminiButton} ${
                loading && "opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* Show ONLY OTP input if OTP sent */}
        {otpSent && (
          <div className="mt-6">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Enter OTP
            </label>
            <div className="flex gap-2">
              <input
                id="otp"
                type="text"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && otp.length === 6 && !otpLoading) {
                    e.preventDefault();
                    handleOtpSubmit();
                  }
                }}
                className="w-full px-4 py-2 rounded-xl bg-[#232334] text-white border border-[#2e2e41] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/30 outline-none transition-all duration-200"
                placeholder="123456"
                autoFocus
              />
              <button
                type="button"
                onClick={handleOtpSubmit}
                disabled={otpLoading || otp.length < 6}
                className={`px-4 py-2 rounded-xl font-semibold text-white shadow-md transition-all duration-150 ${geminiButton} ${
                  (otpLoading || otp.length < 6) &&
                  "opacity-60 cursor-not-allowed"
                }`}
              >
                {otpLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
