import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthSchema } from "@/schemas/authSchema";
import { countries } from "../utils/countries-static";
import toast from "react-hot-toast";
import { useState } from "react";

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

  const onSubmit = (data: AuthSchema) => {
    console.log(data);
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      toast.success("OTP sent!");
    }, 1200);
  };

const handleOtpSubmit = () => {
  setOtpLoading(true);
  setTimeout(() => {
    setOtpLoading(false);
    if (otp === "123456") {
      toast.success("OTP verified! Logging in...");
      // Save token to localStorage or Zustand here 
      localStorage.setItem("auth_token", "dummy_token");
      // Redirect to dashboard 
      window.location.href = "/dashboard";
    } else {
      toast.error("Invalid OTP, please try again.");
    }
  }, 1200);
};


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="country">Country</label>
      <select id="country" {...register("country")}>
        <option value="">Select country</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.dialCode})
          </option>
        ))}
      </select>
      {errors.country && <span>{errors.country.message}</span>}

      <label htmlFor="phone">Phone Number</label>
      <input id="phone" type="tel" maxLength={15} {...register("phone")} />
      {errors.phone && <span>{errors.phone.message}</span>}

      <button type="submit" disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
      {otpSent && (
        <div className="mt-4">
          <label htmlFor="otp">Enter OTP</label>
          <input
            id="otp"
            type="text"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="border p-2 rounded"
            placeholder="123456"
            autoFocus
          />
          <button
            type="button"
            onClick={handleOtpSubmit}
            disabled={otpLoading || otp.length < 6}
            className="ml-2 p-2 rounded bg-blue-600 text-white"
          >
            {otpLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}
    </form>
  );
}
