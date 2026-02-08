import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Alert, Datepicker, Label, Radio, TextInput } from "flowbite-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { registerSchema } from "../../../validationSchema/registerSchema";

const defaultValues = {
  name: "",
  email: "",
  password: "",
  rePassword: "",
  gender: "",
  dateOfBirth: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm({
    defaultValues,
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password");
  const watchedGender = watch("gender");
  const watchedPassword = watch("password");
  const watchedRePassword = watch("rePassword");

  // Add custom styles for datepicker to prevent overflow
  const datepickerStyles = `
    .datepicker-dropdown {
      position: absolute !important;
      z-index: 9999 !important;
    }
  `;

  // Password strength calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;

    const labels = ["Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
    ];

    return {
      strength: strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  // Check if field has valid value
  const isFieldValid = (fieldName) => {
    return touchedFields[fieldName] && !errors[fieldName] && watch(fieldName);
  };

  async function onRegister(data) {
    try {
      const { data: response } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/signup`,
        data,
      );
      if (response.message === "success") {
        toast.success("Welcome! Your account has been created successfully", {
          theme: "dark",
          autoClose: 3000,
        });
        navigate("/login");
        setApiError(null);
      } else if (response.error) {
        toast.error("Registration failed. Please try again", { theme: "dark" });
        throw new Error(response.error);
      }
    } catch (error) {
      setApiError(
        error?.response?.data?.error ||
          "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <>
      <style>{datepickerStyles}</style>
      <section className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="container px-4 mx-auto">
          <div className="w-full max-w-4xl p-10 mx-auto">
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Join us today and start your journey
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 py-12 border border-gray-100 dark:border-gray-700">
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

              <form onSubmit={handleSubmit(onRegister)} className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm">
                      1
                    </span>
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name Field */}
                    <div className="relative">
                      <Label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <TextInput
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          {...register("name")}
                          className="transition-all duration-200"
                          color={
                            errors?.name
                              ? "failure"
                              : isFieldValid("name")
                                ? "success"
                                : "gray"
                          }
                          aria-invalid={errors?.name ? "true" : "false"}
                          aria-describedby={
                            errors?.name ? "name-error" : undefined
                          }
                        />
                        {isFieldValid("name") && (
                          <HiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
                        )}
                      </div>
                      {errors?.name && (
                        <ValidationError error={errors.name.message} />
                      )}
                    </div>

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

                    {/* Date of Birth Field */}
                    <div className="relative">
                      <Label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date of Birth <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        render={({ field }) => (
                          <Datepicker
                            {...field}
                            maxDate={new Date()}
                            value={
                              field.value ? new Date(field.value) : new Date()
                            }
                            onSelectedDateChanged={(date) => {
                              if (date && !isNaN(date.getTime())) {
                                const formattedDate = new Date(date)
                                  .toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .replaceAll("/", "-");
                                field.onChange(formattedDate);
                              }
                            }}
                          />
                        )}
                        name="dateOfBirth"
                        control={control}
                      />
                      {errors?.dateOfBirth && (
                        <ValidationError error={errors?.dateOfBirth.message} />
                      )}
                    </div>

                    {/* Gender Field */}
                    <div className="relative">
                      <Label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-3 mt-1">
                        {/* Male Option */}
                        <label
                          htmlFor="male"
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer flex-1 ${
                            watchedGender === "male"
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-400"
                              : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600"
                          }`}
                        >
                          <Radio
                            id="male"
                            value="male"
                            {...register("gender")}
                            className="cursor-pointer text-purple-600 focus:ring-purple-500"
                          />
                          <span
                            className={`cursor-pointer font-medium text-sm ${
                              watchedGender === "male"
                                ? "text-purple-700 dark:text-purple-300"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            Male
                          </span>
                        </label>

                        {/* Female Option */}
                        <label
                          htmlFor="female"
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer flex-1 ${
                            watchedGender === "female"
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-400"
                              : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600"
                          }`}
                        >
                          <Radio
                            id="female"
                            value="female"
                            {...register("gender")}
                            className="cursor-pointer text-purple-600 focus:ring-purple-500"
                          />
                          <span
                            className={`cursor-pointer font-medium text-sm ${
                              watchedGender === "female"
                                ? "text-purple-700 dark:text-purple-300"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            Female
                          </span>
                        </label>
                      </div>
                      {errors?.gender && (
                        <ValidationError error={errors?.gender.message} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm">
                      2
                    </span>
                    Security
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Password Field */}
                    <div className="relative">
                      <Label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <TextInput
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("password")}
                          className="transition-all duration-200"
                          color={errors?.password ? "failure" : "gray"}
                          aria-invalid={errors?.password ? "true" : "false"}
                          aria-describedby="password-strength password-error"
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

                      {/* Password Strength Indicator */}
                      {watchedPassword && (
                        <div className="mt-2" id="password-strength">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                  level <= passwordStrength.strength
                                    ? passwordStrength.color
                                    : "bg-gray-200 dark:bg-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <p
                            className={`text-xs font-medium ${
                              passwordStrength.strength === 4
                                ? "text-green-600 dark:text-green-400"
                                : passwordStrength.strength === 3
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : passwordStrength.strength === 2
                                    ? "text-orange-600 dark:text-orange-400"
                                    : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {passwordStrength.label} password
                          </p>
                        </div>
                      )}

                      {errors?.password && (
                        <ValidationError error={errors.password.message} />
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                      <Label
                        htmlFor="rePassword"
                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <TextInput
                          id="rePassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("rePassword", {
                            validate: (value) => {
                              if (!value) return "Please confirm your password";
                              if (value !== password)
                                return "Passwords do not match";
                              return true;
                            },
                          })}
                          className="transition-all duration-200"
                          color={
                            errors?.rePassword
                              ? "failure"
                              : watchedRePassword &&
                                  watchedRePassword === watchedPassword &&
                                  !errors?.rePassword
                                ? "success"
                                : "gray"
                          }
                          aria-invalid={errors?.rePassword ? "true" : "false"}
                          aria-describedby={
                            errors?.rePassword ? "repassword-error" : undefined
                          }
                          style={{
                            paddingRight:
                              watchedRePassword &&
                              watchedRePassword === watchedPassword &&
                              !errors?.rePassword
                                ? "4.5rem"
                                : "2.5rem",
                          }}
                        />
                        {watchedRePassword &&
                          watchedRePassword === watchedPassword &&
                          !errors?.rePassword && (
                            <HiCheckCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
                          )}
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <HiEyeOff className="w-5 h-5" />
                          ) : (
                            <HiEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors?.rePassword && (
                        <ValidationError error={errors.rePassword.message} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <AppButton
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    isLoading={isSubmitting}
                    className="w-full py-3 text-base font-semibold transform transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </AppButton>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-purple-600 dark:text-purple-400 font-semibold hover:underline transition-all"
                    >
                      Sign in
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
