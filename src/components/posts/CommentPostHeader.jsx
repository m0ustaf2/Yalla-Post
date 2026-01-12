import { Avatar, Dropdown, DropdownItem } from "flowbite-react";
import { motion as Motion } from "framer-motion";
import { formateDate } from "../../lib/formateDate";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import AppButton from "../shared/AppButton/AppButton";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCommentSchema } from "../../validationSchema/postCommentSchema";
import ValidationError from "../shared/ValidationError/ValidationError";

export default function CommentPostHeader({
  user: { name, photo, body, createdAt, _id, image },
  isComment = false,
  mediaId,
  postId,
}) {
  const { userData } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(image || null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);

  // Delete Post Or Comment
  const queryClient = useQueryClient();
  const { mutate: handelDeletePost } = useMutation({
    mutationFn: deletePostOrComment,
    onSuccess: () => {
      Swal.close();
      isComment
        ? toast.success("Comment Deleted Successfully", { theme: "dark" })
        : toast.success("Post Deleted Successfully", { theme: "dark" });

      // Invalidate immediately for fast UI update
      queryClient.invalidateQueries({
        queryKey: ["user-posts"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["all-posts"],
        refetchType: "active",
      });
      if (postId) {
        queryClient.invalidateQueries({
          queryKey: ["post-Details", postId],
          refetchType: "active",
        });
      }
    },
    onError: () => {
      Swal.close();
      isComment
        ? toast.error("Comment Deleting Failed", { theme: "dark" })
        : toast.error("Post Deleting Failed", { theme: "dark" });
    },
  });

  async function deletePostOrComment() {
    const endPoint = isComment ? "comments" : "posts";
    return await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/${endPoint}/${mediaId}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
  }

  // Confirmation before delete with SweetAlert2
  const confirmDelete = () => {
    Swal.fire({
      title: `Delete ${isComment ? "Comment" : "Post"}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      theme: "dark",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          theme: "dark",
          didOpen: () => {
            Swal.showLoading();
          },
        });
        handelDeletePost();
      }
    });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postCommentSchema),
  });

  // Edit Post Or Comment
  const { mutate: handelEditCommentAndPost, isPending } = useMutation({
    mutationFn: editCommentAndPost,
    onSuccess: () => {
      toast.success(`${isComment ? "Comment" : "Post"} Updated Successfully`, {
        theme: "dark",
      });
      setIsEditing(false);
      setImagePreview(null);
      queryClient.invalidateQueries(["user-posts"]);
      queryClient.invalidateQueries(["all-posts"]);
      queryClient.invalidateQueries(["post-Details", mediaId]);
    },
    onError: () => {
      toast.error(`${isComment ? "Comment" : "Post"} Edit Failed`, {
        theme: "dark",
      });
    },
  });

  async function editCommentAndPost(data) {
    const endPoint = isComment ? "comments" : "posts";
    if (isComment) {
      return await axios.put(
        `${import.meta.env.VITE_BASE_URL}/${endPoint}/${mediaId}`,
        { content: data.content },
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
    }

    const formData = new FormData();
    formData.append("body", data.content);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    return await axios.put(
      `${import.meta.env.VITE_BASE_URL}/${endPoint}/${mediaId}`,
      formData,
      {
        headers: {
          token: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", e.target.files);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Motion.div
      initial={isComment ? { opacity: 0, x: -20, scale: 0.95 } : false}
      animate={isComment ? { opacity: 1, x: 0, scale: 1 } : false}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className={`relative ${
        isComment
          ? "ml-14 mt-4 rounded-2xl bg-linear-to-br from-gray-50/90 to-gray-100/90 dark:from-gray-800/80 dark:to-gray-800/60 p-5 backdrop-blur-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          : ""
      }`}
    >
      {/* Connector dot with glow */}
      {isComment && (
        <Motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="absolute -left-4 top-6 h-3 w-3 rounded-full bg-linear-to-br from-purple-400 to-pink-400 shadow-lg shadow-purple-400/50"
        />
      )}

      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar
              alt={name}
              img={
                !photo.includes("undefined")
                  ? photo
                  : `${
                      import.meta.env.VITE_BASE_URL
                    }/uploads/default-profile.png`
              }
              rounded
              size={isComment ? "sm" : "md"}
              className="ring-2 ring-purple-500/20 dark:ring-purple-400/30"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-sm bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {name}
            </h2>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {formateDate(createdAt)}
            </span>
          </div>
        </div>

        {_id == userData._id && (
          <Dropdown
            inline
            arrowIcon={false}
            className="w-44  rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl bg-white/95 dark:bg-gray-800/95"
            label={
              <div className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer">
                <FiMoreVertical
                  className="text-gray-600 dark:text-gray-400"
                  size={18}
                />
              </div>
            }
          >
            <DropdownItem
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-t-xl transition-colors group"
            >
              <FiEdit2
                className="text-blue-500 group-hover:scale-110 transition-transform"
                size={16}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Edit
              </span>
            </DropdownItem>
            <DropdownItem
              onClick={confirmDelete}
              className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl transition-colors group"
            >
              <FiTrash2
                className="group-hover:scale-110 transition-transform"
                size={16}
              />
              <span className="font-medium">Delete</span>
            </DropdownItem>
          </Dropdown>
        )}
      </header>

      {/* Content */}
      {isEditing ? (
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="relative">
            <textarea
              {...register("content")}
              defaultValue={body}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={4}
              placeholder={`Edit your ${isComment ? "comment" : "post"}...`}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none
                ${
                  errors?.content
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-red-500 dark:focus:ring-red-900/50"
                    : isFocused
                    ? "border-purple-400 ring-4 ring-purple-100 dark:border-purple-500 dark:ring-purple-900/50"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }
                bg-white dark:bg-gray-700 
                text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                outline-none text-sm font-medium
                shadow-sm hover:shadow-md focus:shadow-lg
              `}
            />
            {errors?.content && (
              <ValidationError error={errors?.content.message} />
            )}
          </div>

          {/* Image Upload Section - For Posts Only */}
          {!isComment && (
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleImageChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                  bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 
                  rounded-xl hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 
                  border border-gray-200 dark:border-gray-600
                  transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                  group"
              >
                <FiImage
                  size={16}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span>{imagePreview ? "Change Image" : "Add Image"}</span>
              </button>

              {errors?.image && (
                <ValidationError error={errors?.image.message} />
              )}

              {/* Image Preview with Modern Design */}
              {imagePreview && (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-xl group"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2.5 bg-red-500 text-white rounded-xl 
                      hover:bg-red-600 shadow-lg hover:shadow-xl
                      transition-all duration-200 hover:scale-110 active:scale-95
                      opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </Motion.div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <AppButton
              isLoading={isPending}
              type="button"
              onClick={handleSubmit(handelEditCommentAndPost)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 
                bg-linear-to-r from-purple-500 to-pink-500 
                hover:from-purple-600 hover:to-pink-600
                text-white font-semibold rounded-xl
                shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiCheck size={18} />
              <span>Update</span>
            </AppButton>

            <button
              onClick={() => {
                setIsEditing(false);
                setImagePreview(image || null);
              }}
              type="button"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5
                bg-gray-100 dark:bg-gray-700 
                hover:bg-gray-200 dark:hover:bg-gray-600
                text-gray-700 dark:text-gray-300 font-semibold rounded-xl
                border border-gray-300 dark:border-gray-600
                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiX size={18} />
              <span>Cancel</span>
            </button>
          </div>
        </Motion.div>
      ) : (
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
        >
          {body}
        </Motion.p>
      )}
    </Motion.div>
  );
}
