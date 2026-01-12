import { useMutation } from "@tanstack/react-query";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import AppButton from "../AppButton/AppButton";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext.js";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImageSchema } from "../../../validationSchema/uploadImageSchema";
import ValidationError from "../ValidationError/ValidationError";

export default function ModalShared() {
  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { photo: "" },
    resolver: zodResolver(uploadImageSchema),
    mode: "onChange",
  });
  const { getProfileUserData } = useContext(AuthContext);
  const { mutate: handleUploadPhoto, isPending } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      toast.success("Profile Photo Updated Successfully", { theme: "dark" });
      setOpenModal(false);
      setPreview(null);
      reset();
      getProfileUserData(localStorage.getItem("token"));
    },
    onError: () => {
      toast.error("Profile Photo Upload Failed", { theme: "dark" });
    },
  });

  async function uploadPhoto(data) {
    const formData = new FormData();
    formData.append("photo", data.photo[0]);
    return axios.put(
      `${import.meta.env.VITE_BASE_URL}/users/upload-photo`,
      formData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
  }

  return (
    <>
      <CiEdit
        onClick={() => setOpenModal(true)}
        className="text-2xl cursor-pointer hover:scale-105 transition"
      />

      <Modal
        show={openModal}
        size="md"
        onClose={() => {
          setOpenModal(false);
          setPreview(null);
          reset();
        }}
        popup
        dismissible
      >
        {errors.photo && <ValidationError error={errors.photo.message} />}
        <ModalHeader />
        <ModalBody>
          <form onSubmit={handleSubmit(handleUploadPhoto)}>
            <div className="text-center space-y-4">
     
              <label className="cursor-pointer flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-32 w-32 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <>
                    <svg
                      className="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF (max 4MB)
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  {...register("photo", {
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    },
                  })}
                />
              </label>

          
              <AppButton  onClick={() => setOpenModal(true)} isLoading={isPending} type="submit">
                Upload
              </AppButton>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}
