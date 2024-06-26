"use client";

import React, { useEffect } from "react";
import Welcome from "@/initial-setup/1/_images/Welcome";
import ForwardButton from "@/initial-setup/_components/ForwardButton";
import { useRouter } from "next/navigation";

const welcomingWords =
    "안녕하세요! 먹짐마에 오신걸 환영해요! 저는 인공지능 코치 꾸미라고 해요!";

function Page() {
    const [welcomingText, setWelcomingText] = React.useState<string>("");
    const router = useRouter();

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setWelcomingText((prev) => {
                let text = "";
                for (let j = 0; j <= i; j++) {
                    text += welcomingWords[j];
                }
                return text;
            });
            i++;
            if (i === welcomingWords.length - 1) {
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full animate-page-enter">
            <p className="mt-5 inline-block text-app-font-2 text-2xl leading-9">
                {welcomingText}
            </p>
            <div className="space-y-10 mt-auto">
                <div className="max-w-[470px]">
                    <Welcome />
                </div>

                <ForwardButton
                    title="안녕!"
                    onClick={() => {
                        setTimeout(() => {
                            router.push("/initial-setup/2");
                        }, 500);
                    }}
                />
            </div>
        </div>
    );
}

export default Page;
