import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Alert, Label, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  HiCheckCircle,
  HiEye,
  HiEyeOff,
  HiInformationCircle,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppButton from "../../../components/shared/AppButton/AppButton";
import ValidationError from "../../../components/shared/ValidationError/ValidationError";
import { AuthContext } from "../../../context/AuthContext.js";
import { loginSchema } from "./../../../validationSchema/loginSchema";

const defaultValues = {
  email: "",
  password: "",
};

export default function Login() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm({
    defaultValues,
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // Check if field has valid value
  const isFieldValid = (fieldName) => {
    return touchedFields[fieldName] && !errors[fieldName] && watch(fieldName);
  };

  async function onLogin(data) {
    try {
      const { data: response } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/signin`,
        data,
      );
      if (response.message === "success") {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        toast.success("Welcome back! Login successful", {
          theme: "dark",
          autoClose: 3000,
        });
        navigate("/");
        setApiError(null);
      } else if (response.error) {
        toast.error("Login failed. Please try again", { theme: "dark" });
        throw new Error(response.error);
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.error ||
          "Invalid email or password. Please try again.",
      );
    }
  }

  return (
    <>
      <section className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="container px-4 mx-auto">
          <div className="w-full max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
                <svg
                  className="w-9 h-9 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to continue your journey
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              {apiError && (
                <Alert
                  className="mb-6"
                  color="failure"
                  icon={HiInformationCircle}
                  onDismiss={() => setApiError(null)}
                >
                  <span className="font-medium">Error!</span> {apiError}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
                {/* Email Field */}
                <div className="relative">
                  <Label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <TextInput
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className="transition-all duration-200"
                      color={
                        errors?.email
                          ? "failure"
                          : isFieldValid("email")
                            ? "success"
                            : "gray"
                      }
                      aria-invalid={errors?.email ? "true" : "false"}
                      aria-describedby={
                        errors?.email ? "email-error" : undefined
                      }
                    />
                    {isFieldValid("email") && (
                      <HiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
                    )}
                  </div>
                  {errors?.email && (
                    <ValidationError error={errors.email.message} />
                  )}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <TextInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className="transition-all duration-200"
                      color={errors?.password ? "failure" : "gray"}
                      aria-invalid={errors?.password ? "true" : "false"}
                      aria-describedby={
                        errors?.password ? "password-error" : undefined
                      }
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <HiEyeOff className="w-5 h-5" />
                      ) : (
                        <HiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors?.password && (
                    <ValidationError error={errors.password.message} />
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <AppButton
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    isLoading={isSubmitting}
                    className="w-full py-3 text-base font-semibold transform transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </AppButton>

                  {/* Register Link */}
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-purple-600 dark:text-purple-400 font-semibold hover:underline transition-all"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
