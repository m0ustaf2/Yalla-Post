import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { postCommentSchema } from "../../validationSchema/postCommentSchema";
import ValidationError from "../shared/ValidationError/ValidationError";
import { AuthContext } from "../../context/AuthContext.js";
import { Avatar } from "flowbite-react";
import { 
  FiSend, 
  FiSmile,
  FiX 
} from "react-icons/fi";

export default function AddComment({ post }) {
  const { userData } = useContext(AuthContext);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 300;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postCommentSchema),
  });

  const content = watch("content") || "";
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      toast.success("Comment added! 💬", { theme: "dark" });
      reset();
      setCharCount(0);
      queryClient.invalidateQueries(["post-Details", post]);
      queryClient.invalidateQueries(["all-posts"]);
      queryClient.invalidateQueries(["user-posts"]);
    },
    onError: () => {
      toast.error("Failed to add comment", { theme: "dark" });
    },
  });

  async function addComment(data) {
    const commentData = { ...data, post };
    return await axios.post(
      `${import.meta.env.VITE_BASE_URL}/comments/`,
      commentData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
  }

  const handleTextChange = (e) => {
    setCharCount(e.target.value.length);
  };

  const handleClear = () => {
    reset();
    setCharCount(0);
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <form onSubmit={handleSubmit(mutate)} className="space-y-3">
        {/* Input Container */}
        <div className="relative">
          {/* Avatar and Input Wrapper */}
          <div className="flex items-start gap-3">
            {/* User Avatar */}
            <Avatar
              img={
                userData?.photo && !userData?.photo.includes("undefined")
                  ? userData?.photo
                  : `${import.meta.env.VITE_BASE_URL}/uploads/default-profile.png`
              }
              alt={userData?.name || "User"}
              rounded
              size="md"
              className="ring-2 ring-purple-500/20 dark:ring-purple-400/30 shrink-0"
            />

            {/* Input Field */}
            <div className="flex-1 relative">
              <div
                className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden
                ${errors?.content
                    ? "border-red-300 dark:border-red-500"
                    : isFocused
                      ? "border-purple-400 dark:border-purple-500 shadow-lg shadow-purple-500/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }
                bg-white dark:bg-gray-700`}
              >
                <textarea
                  {...register("content", {
                    onChange: handleTextChange,
                  })}
                  id="comment"
                  placeholder="Write a comment..."
                  maxLength={MAX_CHARS}
                  rows={isFocused ? 3 : 1}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    if (!content.trim()) setIsFocused(false);
                  }}
                  className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white 
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    outline-none resize-none text-sm
                    transition-all duration-300"
                />

                {/* Character Counter & Actions Bar */}
                <AnimatePresence>
                  {(isFocused || content) && (
                    <Motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600"
                    >
                      {/* Left side - Emoji hint */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <FiSmile className="w-4 h-4" />
                        <span className="hidden sm:inline">Emojis supported</span>
                      </div>

                      {/* Right side - Character count */}
                      <span
                        className={`text-xs font-medium transition-colors ${charCount > MAX_CHARS * 0.9
                            ? "text-red-500"
                            : charCount > MAX_CHARS * 0.7
                              ? "text-yellow-500"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                      >
                        {charCount}/{MAX_CHARS}
                      </span>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error Message */}
              {errors?.content && (
                <Motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <ValidationError error={errors?.content.message} />
                </Motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {(isFocused || content) && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 justify-end pl-14"
            >
              {/* Clear Button */}
              {content && !isPending && (
                <Motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                    bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                    rounded-xl border border-gray-300 dark:border-gray-600
                    transition-all duration-200 hover:scale-105 active:scale-95
                    flex items-center gap-2"
                >
                  <FiX size={16} />
                  <span>Clear</span>
                </Motion.button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending || !content.trim() || charCount > MAX_CHARS}
                className="px-6 py-2 flex items-center gap-2
                  bg-linear-to-r from-purple-500 to-pink-500 
                  hover:from-purple-600 hover:to-pink-600
                  text-white font-semibold rounded-xl
                  shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
                  transition-all duration-200 hover:scale-105 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  text-sm relative overflow-hidden group"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent 
                  -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />

                <FiSend className={`w-4 h-4 ${isPending ? "animate-pulse" : ""}`} />
                <span>{isPending ? "Posting..." : "Post Comment"}</span>
              </button>
            </Motion.div>
          )}
        </AnimatePresence>

       
      </form>
    </Motion.div>
  );
}