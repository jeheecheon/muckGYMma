import { PostInfo } from "@/_types/PostInfo";
import exampleImage from "@/_images/pooh.jpg";
import { backendUrl } from "@/_utils/urls";
import { cookies } from "next/headers";

export async function fetchRecentPosts() {
    const cookieStore = cookies();

    return await fetch(`${backendUrl}/api/board/other-posts`, {
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
                console.warn(res.status, res.statusText);
                throw new Error("Server responded with an error");
            }
        })
        .then((data: PostInfo[]) => {
            if (data) {
                return convertPostsCreatedAtToDate(data);
            } else {
                throw new Error("Failed to fetch recent posts");
            }
        })
        .catch((err) => {
            console.error(err);
            const dummyPosts: PostInfo[] = [
                {
                    id: 3,
                    content: "ㅁㄴㅇ",
                    imageUrls: [
                        "https://muckgymma.s3.ap-northeast-2.amazonaws.com/food/62af530b-7986-48b1-b869-ce7d1b0a4e03_2_image.jpg",
                    ],
                    memberId: 2,
                    nickname: "test",
                    likeCount: 0,
                    isLikedByMember: false,
                    commentCount: 0,
                    kcal: 0,
                    createdAt: new Date(),
                    profileUrl:
                        "https://muckgymma.s3.ap-northeast-2.amazonaws.com/food/62af530b-7986-48b1-b869-ce7d1b0a4e03_2_image.jpg",
                },
            ];
            return dummyPosts;
        });
}

export function convertPostsCreatedAtToDate(posts: PostInfo[]): PostInfo[] {
    return posts.map((post) => {
        let date = new Date();
        if (post.createdAt) {
            date = new Date(post.createdAt);
        }
        return {
            ...post,
            postedAt: date,
        };
    });
}