import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useParams } from "react-router-dom";
import PostItem from "../../components/posts/PostItem";
import { useFetch } from "../../hooks/useFetch";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Skeleton from "react-loading-skeleton";

export default function PostDetails() {
  const { id } = useParams();
  const {userData}=useContext(AuthContext)
const {data, isLoading, isError, error} =  useFetch(["post-Details" , id] , `posts/${id}` ,userData )
  return (
    <>
      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-4">
            {isLoading && (
              <Skeleton className="h-96 mb-4" baseColor="#1F2837" highlightColor="#111827" count={3}/>
            )}
            {isError && (
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Info alert!</span> {error}
              </Alert>
            )}
            { data && <PostItem post={data.post} showAllComments={true} />}
          </div>
        </div>
      </section>
    </>
  );
}
