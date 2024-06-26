import { PostInfo } from "@/_types/PostInfo";
import { convertPostsCreatedAtToDate, dummyPosts } from "@/_utils/post";
import { backendUrl } from "@/_utils/urls";
import { FetchNickname } from "@/_utils/user";
import Post from "@/main/_components/Post";
import NavigateBack from "@/main/profile/[username]/(follow)/_components/NavigateBack";
import { Noto_Sans_KR } from "next/font/google";
import { cookies } from "next/headers";
import React, { useEffect } from "react";

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"] });

async function fetchPostById(id: number) {
    const cookieStore = cookies();
    return await fetch(`${backendUrl}/api/board/board?boardId=${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: cookieStore
                .getAll()
                .map((cookie) => {
                    return `${cookie.name}=${cookie.value}`;
                })
                .join("; "),
        },
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Server responded with an error");
            }
        })
        .then((post: PostInfo) => {
            if (post) {
                const likeCountCalculated: PostInfo = {
                    ...post,
                    likeCount: post.likes?.length || 0,
                }
                const [converted] = convertPostsCreatedAtToDate([likeCountCalculated]);
                return converted;
            } else {
                throw new Error("Failed to fetch post");
            }
        })
        .catch((err) => {
            console.error(err);
            const [dummyPost] = dummyPosts;
            return dummyPost;
        });
}

interface PostPageProps {
    params: {
        postId: number;
    };
}

async function PostPage({ params }: PostPageProps) {
    const postId = params.postId;
    const post = await fetchPostById(postId);

    if (!post) {
        return "Failed to fetch post";
    }
    return (
        <div
            className={`fixed top-0 h-[100dvh] w-full bg-app-bg z-[30] ${notoSansKr.className}`}
        >
            <div className="grid grid-cols-3 px-2 py-2 border-b-[1.5px] items-center border-b-gray-200">
                <NavigateBack />
                <div className="w-full flex flex-col items-center justify-center">
                    <p className="text-xs text-app-font-4 font-semibold">{post.nickname}</p>
                    <p className="text-xs text-app-font-1">게시물</p>
                </div>
                <div />
            </div>

            <Post postInfo={post} />
        </div>
    );
}

export default PostPage;
