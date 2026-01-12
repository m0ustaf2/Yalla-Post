import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Alert, Datepicker, Label, Radio, TextInput } from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../../../validationSchema/registerSchema";
import ValidationError from "../../../components/shared/ValidationError/ValidationError";
import AppButton from "../../../components/shared/AppButton/AppButton";
import { useState } from "react";
import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-toastify";

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
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    defaultValues,
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });
const password= watch("password")
  async function onRegister(data) {
    console.log(data);
    try {
      const { data: response } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/signup`,
        data
      );
      if (response.message === "success") {
        toast.success("Register Success", { theme: "dark" });
        navigate("/login");
        setApiError(null);
      } else if (response.error) {
        toast.error("Register Failed", { theme: "dark" });
        throw new Error(response.error);
      }
    } catch (error) {
      setApiError(error?.response.data.error);
    }
  }

  return (
    <>
      <section className="h-screen  bg-linear-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container  px-4 py-6">
          <div className="max-w-2xl mx-auto h-full flex flex-col">
            {/* Header - Compact */}

            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-block p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-purple-600 dark:text-purple-400"
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
            {/* Form Card - Flexible height */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 flex-1 overflow-hidden flex flex-col">
              {apiError && (
                <Alert
                  className="mb-4 animate-shake"
                  color="failure"
                  icon={HiInformationCircle}
                >
                  <span className="font-medium">Oops!</span> {apiError}
                </Alert>
              )}

              <form
                onSubmit={handleSubmit(onRegister)}
                className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div className="relative">
                    <Label
                      htmlFor="name"
                      className="text-gray-700 dark:text-gray-300 font-semibold text-sm"
                    >
                      Full Name
                    </Label>
                    <TextInput
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register("name")}
                      className="transition-all duration-200 mt-1"
                      color={errors?.name ? "failure" : "gray"}
                    />
                    {errors?.name && (
                      <ValidationError error={errors.name.message} />
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-300 font-semibold text-sm"
                    >
                      Email Address
                    </Label>
                    <TextInput
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className="transition-all duration-200 mt-1"
                      color={errors?.email ? "failure" : "gray"}
                    />
                    {errors?.email && (
                      <ValidationError error={errors.email.message} />
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 dark:text-gray-300 font-semibold text-sm"
                    >
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <TextInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password")}
                        className="transition-all duration-200"
                        color={errors?.password ? "failure" : "gray"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
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

                  {/* Confirm Password Field */}
                 
                  <div className="relative">
                    <Label
                      htmlFor="rePassword"
                      className="text-gray-700 dark:text-gray-300 font-semibold text-sm"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative mt-1">
                      <TextInput
                        id="rePassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("rePassword", {
                          validate: (value) => {
                            if (!value) return "please confirm your password";
                            if (value !== password)
                              return "passwords do not match";
                            return true;
                          },
                        })}
                        className="transition-all duration-200"
                        color={errors?.rePassword ? "failure" : "gray"}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10"
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

                  {/* Date of Birth Field */}
                  <div className="relative">
                    <Label className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                      Date of Birth
                    </Label>
                    <div className="mt-1">
                      <Controller
                        render={({ field }) => (
                          <Datepicker
                            {...field}
                            maxDate={new Date()}
                            value={
                              field.value ? new Date(field.value) : new Date()
                            }
                            onChange={(date) => {
                              if (date) {
                                const formatedDate = new Date(date)
                                  .toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .replaceAll("/", "-");
                                return field.onChange(formatedDate);
                              }
                            }}
                          />
                        )}
                        name="dateOfBirth"
                        control={control}
                      />
                    </div>
                    {errors?.dateOfBirth && (
                      <ValidationError error={errors?.dateOfBirth.message} />
                    )}
                  </div>

                  {/* Gender Field */}

                  <div className="relative">
                    <Label className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                      Gender
                    </Label>
                    <div className="flex gap-4 mt-2">
                      {/* Male Option */}
                      <label
                        htmlFor="male"
                        className="flex items-center gap-2 p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-all cursor-pointer flex-1"
                      >
                        <Radio
                          id="male"
                          value="male"
                          {...register("gender")}
                          className="cursor-pointer"
                        />
                        <span className="cursor-pointer font-medium text-sm">
                          Male
                        </span>
                      </label>

                      {/* Female Option */}
                      <label
                        htmlFor="female"
                        className="flex items-center gap-2 p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-all cursor-pointer flex-1"
                      >
                        <Radio
                          id="female"
                          value="female"
                          {...register("gender")}
                          className="cursor-pointer"
                        />
                        <span className="cursor-pointer font-medium text-sm">
                          Female
                        </span>
                      </label>
                    </div>
                    {errors?.gender && (
                      <ValidationError error={errors?.gender.message} />
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 space-y-3">
                  <AppButton
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    isLoading={isSubmitting}
                    className="w-full transform transition-all duration-200 "
                  >
                    Create Account
                  </AppButton>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
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
