"use client";

import React, { useEffect } from "react";
import ForwardButton from "../_components/ForwardButton";
import ShyCat from "@/initial-setup/2/_images/ShyCat";
import { useRouter } from "next/navigation";

const welcomingWords =
    "주인님의 취향에 맞는 운동 플랜을 추천해드리기 위해 몇가지 질문을 드릴게요!";

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
        <div className="flex flex-col h-full">
            <p className="mt-5 inline-block text-white/90 text-2xl leading-9">
                {welcomingText}
            </p>
            <div className="space-y-10 mt-auto">
                <ShyCat />

                <ForwardButton
                    title="알겠어!"
                    onClick={() => {
                        setTimeout(() => {
                            router.push("/initial-setup/3");
                        }, 500);
                    }}
                />
            </div>
        </div>
    );
}

export default Page;