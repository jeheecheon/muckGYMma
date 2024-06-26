import React from "react";
import Post from "@/main//_components/Post";
import NoData from "@/main/profile/_components/NoData";
import { fetchUserPosts, sortPostsByDate } from "@/_utils/post";

interface PostsPageProps {
    params: { username: string };
}

async function PostsPage({ params }: Readonly<PostsPageProps>) {
    const nickname = decodeURIComponent(params.username);
    const posts = await fetchUserPosts(nickname);
    const sortedPosts = sortPostsByDate(posts);
    
    return (
        <>
            {sortedPosts.length > 0 ? (
                <div className="flex flex-col items-center gap-3 bg-app-bg-1">
                    {sortedPosts.map((post, i) => (
                        <Post key={i} postInfo={post} />
                    ))}
                </div>
            ) : (
                <NoData text="업로드된 포스트가 없습니다." />
            )}
        </>
    );
}

export default PostsPage;

// <div className="grid grid-cols-3 gap-1 md:gap-3">
//     {Array.from({ length: 16 }).map((_, i) => (
//         <div key={i} className="aspect-square overflow-clip">
//             <Image src={exampleImage} alt="avatar" />
//         </div>
//     ))}
// </div>
