import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { FiMessageCircle, FiHeart } from "react-icons/fi";
import { useState } from "react";
import AddComment from "./AddComment";
import CommentPostHeader from "./CommentPostHeader";


export default function PostItem({ post, showAllComments = false }) {
  const { body, comments, image, user, createdAt, _id } = post;
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(showAllComments);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
        
      <Card
        className="overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl 
        shadow-xl hover:shadow-2xl transition-all duration-500 
        hover:-translate-y-2 rounded-3xl relative"
      >
        {/* Header */}
        <div className="relative">
          <CommentPostHeader
            user={{ ...user, createdAt, body, image }}
            mediaId={_id}
            postId={_id}
            isComment={false}
          />
        </div>

        {/* Image Section with Creative Overlay */}
        {image && (
          <Motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden my-4 -mx-6 group/image"
          >
            <img
              src={image}
              alt={body}
              className="w-full max-h-150 object-cover transition-transform duration-700 
                group-hover/image:scale-110"
            />

            {/* Creative gradient overlay */}
            <div
              className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 
              opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
            />
          </Motion.div>
        )}

        {/* Engagement Bar */}
        <div className="flex items-center justify-center py-4 px-2 border-y border-gray-200 dark:border-gray-700">
          {/* Left actions */}
          <div className="flex items-center justify-center gap-3">
            {/* Like Button */}
            <Motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`group/btn flex items-center gap-2 px-4 py-2.5 rounded-xl 
                transition-all duration-300 hover:scale-105
                ${
                  isLiked
                    ? "bg-linear-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/30"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              <Motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <FiHeart
                  className={`w-5 h-5 transition-all ${
                    isLiked ? "fill-current" : ""
                  }`}
                />
              </Motion.div>
              <span className="font-semibold text-sm hidden sm:inline">
                {isLiked ? "Liked" : "Like"}
              </span>
            </Motion.button>
            {/* Comment Button */}
            <Link to={`/posts/${_id}`}>
              <Motion.button
                whileTap={{ scale: 0.9 }}
                className="group/btn flex items-center gap-2 px-4 py-2.5 rounded-xl 
                  bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
                  hover:bg-linear-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white
                  transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <FiMessageCircle className="w-5 h-5" />
                <span className="font-semibold text-sm hidden sm:inline">
                  Comment
                </span>
                {comments && comments.length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                    {comments.length}
                  </span>
                )}
              </Motion.button>
            </Link>
          </div>
        </div>

        {/* Comments Section */}
        {comments && comments.length > 0 && (
          <div className="mt-4 space-y-3">
            {/* Comments Header */}
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg">
                  <FiMessageCircle className="w-4 h-4 text-white" />
                </div>
                Comments ({comments.length})
              </h3>

              {comments.length > 1 && !showAllComments && (
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-xs font-semibold text-purple-500 hover:text-purple-600 
                    dark:text-purple-400 dark:hover:text-purple-300 transition-colors
                    px-3 py-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  {showComments ? "Show Less" : `View All ${comments.length}`}
                </button>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {showComments || showAllComments ? (
                <>
                  {comments.map((comment, index) => (
                    <Motion.div
                      key={comment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CommentPostHeader
                        user={{
                          ...comment.commentCreator,
                          createdAt: comment.createdAt,
                          body: comment.content,
                        }}
                        isComment={true}
                        mediaId={comment._id}
                        postId={_id}
                      />
                    </Motion.div>
                  ))}
                </>
              ) : (
                <Motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <CommentPostHeader
                    user={{
                      ...comments[comments.length - 1].commentCreator,
                      createdAt: comments[comments.length - 1].createdAt,
                      body: comments[comments.length - 1].content,
                    }}
                    mediaId={comments[comments.length - 1]._id}
                    postId={_id}
                    isComment={true}
                  />
                </Motion.div>
              )}
            </div>
          </div>
        )}

        {/* Add Comment Section */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <AddComment post={_id} />
        </div>

        {/* Decorative bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 
          transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        />
      </Card>
    </Motion.div>
  );
}
