// import { Alert, Pagination } from "flowbite-react";
// import { useContext, useState } from "react";
// import { HiInformationCircle } from "react-icons/hi";
// import Skeleton from "react-loading-skeleton";
// import { AuthContext } from "../../context/AuthContext.js";
// import { useFetch } from "../../hooks/useFetch";
// import PostItem from "./PostItem";
// import Add from "./Add";

// export default function PostList({ fromHome = true }) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { userData } = useContext(AuthContext);
  

//   const queryKey = fromHome 
//     ? ["all-posts", currentPage] 
//     : ["user-posts", currentPage];
    
  
//   const apiUrl = fromHome
//     ? `posts?limit=40&sort=-createdAt&page=${currentPage}`
//     : `users/${userData?._id}/posts`;

//   const { data, isLoading, isError, error } = useFetch(
//     queryKey,
//     apiUrl,
//     userData
//   );

  
//   const onPageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

  
//   const paginationInfo = data?.paginationInfo || {};
//   const { numberOfPages = 1 } = paginationInfo;

//   return (
//     <>
//       <Add />
//       <section className="py-12">
//         <div className="max-w-3xl mx-auto">
//           <div className="flex flex-col gap-4">
//             {isLoading && (
//               <Skeleton
//                 className="h-96 mb-4"
//                 baseColor="#1F2837"
//                 highlightColor="#111827"
//                 count={5}
//               />
//             )}
//             {isError && (
//               <Alert color="failure" icon={HiInformationCircle}>
//                 <span className="font-medium">Error!</span> {error}
//               </Alert>
//             )}
//             {data && data?.posts?.length > 0 ? (
//               data?.posts.map((post) => (
//                 <PostItem key={post?._id} post={post} />
//               ))
//             ) : (
//               !isLoading && (
//                 <Alert color="info" icon={HiInformationCircle}>
//                   <span className="font-medium">No posts found!</span>
//                 </Alert>
//               )
//             )}
//           </div>

       
//           {data && numberOfPages > 1 && (
//             <>
//               <div className="flex overflow-x-auto sm:justify-center mt-8">
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={numberOfPages}
//                   onPageChange={onPageChange}
//                   showIcons
//                   previousLabel="Previous"
//                   nextLabel="Next"
//                 />
//               </div>
              
           
//               {paginationInfo.total && (
//                 <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
//                   Showing page {currentPage} of {numberOfPages} 
//                   ({paginationInfo.total} total posts)
//                 </div>
//               )}

            
             
//             </>
//           )}
//         </div>
//       </section>
//     </>
//   );
// }
import { Alert, Pagination } from "flowbite-react";
import { useContext, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import Skeleton from "react-loading-skeleton";
import { AuthContext } from "../../context/AuthContext.js";
import { useFetch } from "../../hooks/useFetch";
import PostItem from "./PostItem";
import Add from "./Add";

export default function PostList({ fromHome = true }) {
  const [currentPage, setCurrentPage] = useState(1);
  const { userData } = useContext(AuthContext);
  
  // Don't build query if userData is needed but not available
  const queryKey = fromHome 
    ? ["all-posts", currentPage] 
    : userData?._id ? ["user-posts", userData._id, currentPage] : null;
    
  const apiUrl = fromHome
    ? `posts?limit=40&sort=-createdAt&page=${currentPage}`
    : userData?._id ? `users/${userData._id}/posts` : null;

  const { data, isLoading, isError, error } = useFetch(
    queryKey,
    apiUrl,
    userData
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Early return if we're on profile page but userData isn't loaded yet
  if (!fromHome && !userData) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <Skeleton
          className="h-96 mb-4"
          baseColor="#1F2837"
          highlightColor="#111827"
          count={3}
        />
      </div>
    );
  }
  
  const paginationInfo = data?.paginationInfo || {};
  const { numberOfPages = 1 } = paginationInfo;

  return (
    <>
      <Add />
      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-4">
            {isLoading && (
              <Skeleton
                className="h-96 mb-4"
                baseColor="#1F2837"
                highlightColor="#111827"
                count={5}
              />
            )}
            {isError && (
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Error!</span> {error?.message || 'Something went wrong'}
              </Alert>
            )}
            {data?.posts && data.posts.length > 0 ? (
              data.posts.map((post) => (
                post && <PostItem key={post._id} post={post} />
              ))
            ) : (
              !isLoading && (
                <Alert color="info" icon={HiInformationCircle}>
                  <span className="font-medium">No posts found!</span>
                </Alert>
              )
            )}
          </div>

          {/* Pagination */}
          {data && numberOfPages > 1 && (
            <>
              <div className="flex overflow-x-auto sm:justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={numberOfPages}
                  onPageChange={onPageChange}
                  showIcons
                  previousLabel="Previous"
                  nextLabel="Next"
                />
              </div>
              
              {/* Page Info */}
              {paginationInfo.total && (
                <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing page {currentPage} of {numberOfPages} 
                  ({paginationInfo.total} total posts)
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}