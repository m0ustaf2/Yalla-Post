import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { changePasswordSchema } from "../../../validationSchema/changePasswordSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import AppButton from "../AppButton/AppButton";
import { HiEye, HiEyeOff, HiLockClosed } from "react-icons/hi";
import {
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import ValidationError from "../ValidationError/ValidationError";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordModal() {
  const [openModal, setOpenModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });
  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const { mutate: handleChangePassword, isPending } = useMutation({
    mutationFn: changePassword,

    onSuccess: () => {
      toast.info(
        "Password changed! Your session has ended. Please login with your new password.",
        {
          theme: "dark",
          autoClose: 2000,
        }
      );
      setOpenModal(false);
      reset();
      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }, 3000);
    },
    onError: (error) => {
      console.log(error);

      const errorMessage =
        error?.response?.data?.error || "Failed to change password";
      toast.error(errorMessage, { theme: "dark" });
    },
  });
  async function changePassword(data) {
    console.log(data);

    return axios.patch(
      `${import.meta.env.VITE_BASE_URL}/users/change-password`,
      data,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
  }
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset();
    setShowPasswords({
      current: false,
      new: false,
    });
  };
  return (
    <>
      <AppButton
        className="px-6 py-2 rounded-full"
        onClick={() => setOpenModal(true)}
      >
        <HiLockClosed className="mr-2 h-5 w-5" />
        Change Password
      </AppButton>

      <Modal
        show={openModal}
        size="md"
        onClose={handleCloseModal}
        popup
        dismissible
      >
        <ModalHeader>
          <div className="px-6 pt-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Change Password
            </h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Current Password */}
            <div className="relative">
              <Label htmlFor="password" value="Current Password" />
              <div className="relative mt-1">
                <TextInput
                  id="password"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Enter your current password"
                  color={errors.password ? "failure" : "gray"}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPasswords.current ? (
                    <HiEyeOff className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <ValidationError error={errors.password.message} />
              )}
            </div>

            {/* New Password */}
            <div className="relative">
              <Label htmlFor="newPassword" value="New Password" />
              <div className="relative mt-1">
                <TextInput
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter your new password"
                  color={errors.newPassword ? "failure" : "gray"}
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPasswords.new ? (
                    <HiEyeOff className="h-5 w-5" />
                  ) : (
                    <HiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <ValidationError error={errors.newPassword.message} />
              )}
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="font-semibold mb-1">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <AppButton
                onClick={handleSubmit(handleChangePassword)}
                isLoading={isPending}
                className="flex-1"
              >
                Change Password
              </AppButton>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isPending}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
