import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "./../../../validationSchema/loginSchema";
import axios from "axios";
import { HiEye, HiEyeOff, HiInformationCircle } from "react-icons/hi";
import AppButton from "../../../components/shared/AppButton/AppButton";
import { Alert, Label, TextInput } from "flowbite-react";
import ValidationError from "../../../components/shared/ValidationError/ValidationError";
import { AuthContext} from "../../../context/authContext";

const defaultValues = {
  name: "",
  email: "",
  password: "",
  rePassword: "",
  gender: "",
  dateOfBirth: "",
};
export default function Login() {
  const {setToken}= useContext(AuthContext)
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
const [showPassword, setShowPassword] = useState(false);


 const {
     register,
     handleSubmit,
     formState: { errors, isSubmitting, isValid},
   } = useForm({
     defaultValues,
     resolver: zodResolver(loginSchema),
     mode: "onChange",
   });
  async function onLogin(data) {
    try {
      const { data: response } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/signin`,
        data
      );
      if (response.message === "success") {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        navigate("/");
        setApiError(null);
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      setApiError(error?.response.data.error);
    }
  }
  return (
    <>
     <section className="min-h-screen py-12 bg-linear-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container px-4">
            <div className="max-w-xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8 animate-fade-in">
                <div className="inline-block p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                  <svg className="w-12 h-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-3xl">
                {apiError && (
                  <Alert
                    className="mb-6 animate-shake"
                    color="failure"
                    icon={HiInformationCircle}
                  >
                    <span className="font-medium">Oops!</span> {apiError}
                  </Alert>
                )}
    
                <form
                  onSubmit={handleSubmit(onLogin)}
                  className="flex flex-col gap-5"
                >
               

                  {/* Email Field */}
                  <div className="relative">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">
                      Email Address
                    </Label>
                    <TextInput
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className="transition-all duration-200 mt-2"
                      color={errors?.email ? "failure" : "gray"}
                    />
                    {errors?.email && <ValidationError error={errors.email.message} />}
                  </div>
    
                  {/* Password Field */}
                  <div className="relative">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold">
                      Password
                    </Label>
                    <div className="relative mt-2">
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
                    {errors?.password && <ValidationError error={errors.password.message} />}
                  </div>
    
                  {/* Submit Button */}
                  <AppButton
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    isLoading={isSubmitting}
                    className="mt-4 transform transition-all duration-200 hover:scale-105"
                  >
                    Sign In
                  </AppButton>
    
                  {/* Login Link */}
                  <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                    Don't have an account?
                    <a
                      href="/register"
                      className="text-purple-600 ms-1 dark:text-purple-400 font-semibold hover:underline"
                    >
                      Sign up
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
