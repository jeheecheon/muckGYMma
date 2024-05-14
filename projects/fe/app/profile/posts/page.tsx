import Image from "next/image";
import React from "react";
import exampleImage from "@/_images/pooh.jpg";
import Post from "@/community/following/_components/Post";

function Page() {
    const dummyPost = {
        comments: 0,
        content:
            "Hello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello world",
        hasLiked: false,
        id: 1,
        image: exampleImage,
        likes: 0,
        postedAt: new Date(),
        user: {
            name: "John Doe",
            avatar: exampleImage,
        },
    };

    return (
        // <div className="grid grid-cols-3 gap-1 md:gap-3">
        //     {Array.from({ length: 16 }).map((_, i) => (
        //         <div key={i} className="aspect-square overflow-clip">
        //             <Image src={exampleImage} alt="avatar" />
        //         </div>
        //     ))}
        // </div>
        <div className="pt-4 flex flex-col items-center gap-3">
            {Array.from({ length: 16 }).map((_, i) => (
                <Post key={i} postInfo={dummyPost} />
            ))}
        </div>
    );
}

export default Page;
