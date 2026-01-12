import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { 
  FiTrash2, 
  FiImage, 
  FiSend, 
  FiSmile,
  FiX 
} from "react-icons/fi";
import { toast } from "react-toastify";
import { postCommentSchema } from "../../validationSchema/postCommentSchema";
import ValidationError from "../shared/ValidationError/ValidationError";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Add() {
  const fileInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 300;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postCommentSchema),
  });

  const image = watch("image");
  const bodyText = watch("body") || "";
  const { ref, ...registerProps } = register("image");

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      reset();
      setCharCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Post Created Successfully! 🎉", { theme: "dark" });
      queryClient.invalidateQueries(["all-posts"]);
      queryClient.invalidateQueries(["user-posts"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Post Creation Failed", { theme: "dark" });
    },
  });

  async function addPost(data) {
    const formData = new FormData();
    formData.append("body", data.body);
    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    return await axios.post(
      `${import.meta.env.VITE_BASE_URL}/posts`,
      formData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
  }

  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTextChange = (e) => {
    setCharCount(e.target.value.length);
  };

  return (
    <section className="py-6">
      <div className="max-w-3xl mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 p-1">
            <div className="bg-white dark:bg-gray-800 rounded-t-3xl pt-6 px-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <FiSmile className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Create a Post
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Share your thoughts with the world
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(mutate)} className="p-6 space-y-5">
            {/* Textarea with modern styling */}
            <div className="relative">
              <div className={`relative rounded-2xl border-2 transition-all duration-300 
                ${errors?.body 
                  ? 'border-red-300 dark:border-red-500' 
                  : isFocused 
                    ? 'border-purple-400 dark:border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <textarea
                  {...register("body", {
                    onChange: handleTextChange
                  })}
                  id="comment"
                  placeholder="What's on your mind? Share your story, ideas, or moments..."
                  rows={4}
                  maxLength={MAX_CHARS}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full px-5 py-4 bg-transparent text-gray-900 dark:text-white 
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    outline-none resize-none text-base rounded-2xl"
                />
                
                {/* Character counter */}
                <div className="absolute bottom-3 right-4 flex items-center gap-2">
                  <span className={`text-xs font-medium transition-colors ${
                    charCount > MAX_CHARS * 0.9 
                      ? 'text-red-500' 
                      : charCount > MAX_CHARS * 0.7
                        ? 'text-yellow-500'
                        : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>
              </div>
              
              {errors?.body && (
                <Motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ValidationError error={errors.body.message} />
                </Motion.div>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              {!image?.[0] ? (
                <label
                  htmlFor="dropzone-file"
                  className="group relative flex flex-col items-center justify-center w-full h-40 
                    border-2 border-dashed rounded-2xl cursor-pointer
                    border-gray-300 dark:border-gray-600
                    bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800
                    hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20
                    hover:border-purple-400 dark:hover:border-purple-500
                    transition-all duration-300 hover:shadow-xl overflow-hidden"
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-linear-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 
                    group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-purple-500/5 
                    transition-all duration-500" 
                  />
                  
                  <div className="relative flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl 
                      shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <FiImage className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPEG, PNG, JPG (MAX 1MB)
                      </p>
                    </div>
                  </div>

                  <input
                    {...registerProps}
                    ref={(e) => {
                      ref(e);
                      fileInputRef.current = e;
                    }}
                    type="file"
                    id="dropzone-file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              ) : (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 
                    shadow-xl group bg-gray-100 dark:bg-gray-700"
                >
                  <img
                    src={URL.createObjectURL(image[0])}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                  />
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-xl 
                      hover:bg-red-600 shadow-lg hover:shadow-xl
                      transition-all duration-200 hover:scale-110 active:scale-95
                      opacity-0 group-hover:opacity-100 flex items-center gap-2"
                  >
                    <FiTrash2 size={16} />
                    <span className="text-sm font-medium">Remove</span>
                  </button>

                  {/* Image info */}
                  <div className="absolute bottom-4 left-4 px-3 py-2 bg-black/60 backdrop-blur-sm 
                    rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-xs text-white font-medium">
                      {image[0].name}
                    </p>
                    <p className="text-xs text-gray-300">
                      {(image[0].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </Motion.div>
              )}

              {errors?.image && (
                <Motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ValidationError error={errors?.image.message} />
                </Motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending || !bodyText.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5
                  bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 bg-size-200 bg-pos-0
                  hover:bg-pos-100 text-white font-bold rounded-xl
                  shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  relative overflow-hidden group"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent 
                  -translate-x-full group-hover:translate-x-full transition-transform duration-700" 
                />
                
                <FiSend className={`w-5 h-5 ${isPending ? 'animate-pulse' : ''}`} />
                <span>{isPending ? 'Posting...' : 'Share Post'}</span>
              </button>

              {(bodyText.trim() || image?.[0]) && !isPending && (
                <Motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="button"
                  onClick={() => {
                    reset();
                    setCharCount(0);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="px-5 py-3.5 bg-gray-100 dark:bg-gray-700 
                    hover:bg-gray-200 dark:hover:bg-gray-600
                    text-gray-700 dark:text-gray-300 font-semibold rounded-xl
                    border border-gray-300 dark:border-gray-600
                    transition-all duration-200 hover:scale-105 active:scale-95
                    flex items-center gap-2"
                >
                  <FiX size={18} />
                  <span className="hidden sm:inline">Clear</span>
                </Motion.button>
              )}
            </div>

            {/* Tips section */}
            {isFocused && !bodyText.trim() && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-linear-to-r from-purple-50 to-pink-50 
                  dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
              >
                <div className="p-2 bg-purple-500 rounded-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Pro Tips
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Share your authentic thoughts and experiences</li>
                    <li>• Add images to make your post more engaging</li>
                    <li>• Be respectful and kind to others</li>
                  </ul>
                </div>
              </Motion.div>
            )}
          </form>
        </Motion.div>
      </div>
    </section>
  );
}