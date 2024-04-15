"use client";

import { backendUrl } from "@/_utils/urls";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
    children: React.ReactNode;
}

function InitialLoad(props: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (process.env.NODE_ENV !== "development") {
            fetch(`${backendUrl}/api/login/check`, {
                method: "GET",
                credentials: "include",
            }).then((res) => {
                if (res.ok) {
                    setLoading(false);
                } else {
                    router.push("/sign-in");
                }
            });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full max-h-[100dvh] animate-pulse">
                    <div
                        className="w-[40px] h-[40px] rounded-full border-t-stone-200 border-t-4 border-4 border-stone-400 
                        animate-spin"
                    />
                    <div className="animate-bounce mt-3">
                        <p className="text-white/90">Welcome to 먹짐마!</p>
                    </div>
                </div>
            ) : (
                props.children
            )}
        </>
    );
}

export default InitialLoad;