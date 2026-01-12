import { Avatar, Card } from "flowbite-react";
import { useContext } from "react";
import { HiCake, HiMail, HiUser } from "react-icons/hi";
import Skeleton from "react-loading-skeleton";
import { AuthContext } from "../../context/AuthContext.js";
import ChangePasswordModal from "../shared/ChangePasswordModal/ChangePasswordModal";
import ModalShared from "../shared/ModalShared/ModalShared";
import { formateDate } from './../../lib/formateDate';

export default function ProfileCard() {
  const { userData } = useContext(AuthContext);

  return (
      <section className="pt-16">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="relative overflow-hidden border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-xl rounded-2xl">
          {/* Gradient top */}
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {userData ? (
            <>
              <div className="relative flex flex-col items-center pt-16 pb-10">
                {/* Avatar */}
                <Avatar
                  img={userData?.photo}
                  alt={userData?.name}
                  rounded
                  className="size-28 avatar ring-4 ring-white dark:ring-gray-900 shadow-lg hover:scale-105 transition"
                />
                <ModalShared />
                {/* Name */}
                <h5 className="mt-4 text-center">
                  <span className="block text-sm text-gray-500 dark:text-gray-400">
                    👋 Welcome back
                  </span>
                  <span className="block text-2xl font-bold bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    {userData.name}
                  </span>
                </h5>
                {/* Info */}
                <div className="mt-4 w-full max-w-sm space-y-2">
                  <InfoRow icon={<HiMail />} value={userData?.email} />
                  <InfoRow icon={<HiCake />} value={formateDate(userData?.dateOfBirth)} />
                  <InfoRow icon={<HiUser />} value={userData?.gender} />
                </div>
                {/* Action */}
                <div className="mt-6">
                  <ChangePasswordModal />
                </div>
              </div>
            </>
          ) : (
            <>
              <GradientProfileSkeleton />
            </>
          )}
        </Card>
      </div>
    </section>
  );
}

function InfoRow({ icon, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-100/70 dark:bg-gray-800/70 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
      <span className="text-indigo-500 text-lg">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function GradientProfileSkeleton() {
  return (
    <div className="relative flex flex-col items-center pt-16 pb-10 space-y-4">
      {/* Avatar */}
      <Skeleton
        circle
        height={112} // size-28
        width={112}
        baseColor="#374151"
        highlightColor="#7F00FF" // Gradient vibe
        className="animate-pulse"
      />
      {/* Name */}
      <div className="w-40 text-center">
        <Skeleton
          height={20}
          width="100%"
          baseColor="#6B7280"
          highlightColor="#A78BFA"
          className="rounded-md animate-pulse"
        />
        <Skeleton
          height={28}
          width="100%"
          baseColor="#374151"
          highlightColor="#C084FC"
          className="rounded-md mt-1 animate-pulse"
        />
      </div>
      {/* Info rows */}
      <div className="w-full max-w-sm space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            height={36}
            width="100%"
            baseColor="#E5E7EB"
            highlightColor="#C084FC"
            borderRadius={8}
            className="animate-pulse"
          />
        ))}
      </div>
      {/* Buttons */}
      <div className="flex flex-col w-full gap-2 mt-4 max-w-sm">
        <Skeleton
          height={40}
          width="100%"
          baseColor="#3B82F6"
          highlightColor="#8B5CF6"
          borderRadius={9999}
          className="animate-pulse"
        />
        <Skeleton
          height={40}
          width="100%"
          baseColor="#9CA3AF"
          highlightColor="#A78BFA"
          borderRadius={9999}
          className="animate-pulse"
        />
      </div>
    </div>
  );
}
