"use client";

import React, { useEffect, useRef } from "react";
import ArrowUp from "../_images/ArrowUp";
import Image from "next/image";
import exampleImage from "@/_images/pooh.jpg";
import { backendUrl } from "@/_utils/urls";
import { SimpleUserInfo } from "@/_utils/user";

function CommentSectionTextArea({
    text,
    setText,
    onSubmit,
}: {
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: () => void;
}) {
    const hiddenTextArea = useRef<HTMLTextAreaElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const [userInnfo, setUserInfo] = React.useState<SimpleUserInfo>({
        profileImageUrl: exampleImage.src,
        nickname: "",
    });

    useEffect(() => {
        if (!hiddenTextArea.current || !textArea.current) return;

        hiddenTextArea.current.value = textArea.current.value;
        textArea.current.style.height =
            hiddenTextArea.current.scrollHeight + 5 + "px";

        // textArea.current.style.width = hiddenTextArea.current.style.width;

        fetch(`${backendUrl}/api/profile/main-profile`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Failed to fetch user info");
            })
            .then((data: SimpleUserInfo) => {
                if (data) {
                    setUserInfo(data);
                } else {
                    throw new Error("Failed to fetch user info");
                }
            })
            .catch((err) => {
                console.error(err);
                const info: SimpleUserInfo = {
                    profileImageUrl: exampleImage.src,
                    nickname: "JohnDoe",
                };
                setUserInfo(info);
            });
    }, [text]);

    return (
        <>
            <div className="w-full flex gap-2 px-2 pb-1 pt-2 bottom-0 bg-app-bg">
                {/* Avatar Image */}
                <div className="w-[45px] h-[45px]">
                    <div className="w-[45px] h-[45px] overflow-clip rounded-full">
                        <Image
                            src={userInnfo.profileImageUrl}
                            alt="User avatar"
                            className="w-[45px] h-[45px] pointer-events-none"
                            width={43}
                            height={43}
                        />
                    </div>
                </div>

                <div className="w-full">
                    {/* Hidden Text Area */}
                    <textarea
                        ref={hiddenTextArea}
                        value={text}
                        className="min-h-[37px] absolute invisible w-full overflow-y-scroll py-2 pl-3 pr-10"
                        rows={1}
                    />

                    {/* Input Comment */}
                    <textarea
                        ref={textArea}
                        value={text}
                        maxLength={700}
                        onInput={(e) => setText(e.currentTarget.value)}
                        rows={1}
                        className="w-full h-fit min-h-[25px] py-2 rounded-xl pl-3 pr-10 bg-app-bg-2 text-app-font-3 
                        focus:outline-none outline-none resize-none max-h-[35dvh] overflow-y-scroll
                        duration-75 transition-all"
                        placeholder="댓글을 남겨보세요!"
                    />
                </div>

                <div
                    className="absolute bottom-4 right-6 px-1 py-1 bg-app-bg rounded-lg"
                    onClick={onSubmit}
                >
                    <ArrowUp className="stroke-app-font-4" />
                </div>
            </div>
        </>
    );
}

export default CommentSectionTextArea;
