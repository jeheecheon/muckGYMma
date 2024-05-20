"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useRef } from "react";
import { useAppDispatch } from "@/../lib/hooks";
import { backendUrl } from "@/_utils/urls";
import { PredictState, setPredict } from "@/../lib/slices/predictSlice";

interface UploadMenuProps {
    className?: string;
    isVisible: boolean;
}

function UploadMenu({ className, isVisible }: UploadMenuProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();

    function handleClicked() {
        inputRef.current?.click();
    }

    function handleUpload(e: FormEvent<HTMLInputElement>) {
        if (e.currentTarget.files) {
            const file = e.currentTarget.files[0];
            const formData = new FormData();
            formData.append("file", file);

            fetch(`${backendUrl}/api/foods/predict`, {
                method: "POST",
                credentials: "include",
                body: formData,
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error("Error occured while uploading image.");
                    }
                })
                .then((data: PredictState) => {
                    if (!data.predictlist) {
                        throw new Error("No prediction data found.");
                    }

                    for (let predict of data.predictlist) {
                        predict.possibility = parseFloat(
                            predict.possibility.toFixed(5)
                        );
                    }
                    dispatch(setPredict(data));
                    router.push(`/prediction/pick-one`);
                })
                .catch((err) => console.error(err));
        } else {
            console.error("No file selected.");
        }
    }

    return (
        <>
            <div
                className={`bg-app-bg shadow-xl text-app-font-2 font-semibold 
                text-base px-3 py-2 rounded-2xl transition-opacity duration-500
                flex flex-col items-start ${
                isVisible ? "opacity-100" : "opacity-0"
                } ${className}`}
            >
                <button className="text-nowrap">포스트 작성</button>

                <div className="my-1 border-b-[1px] border-b-app-font-6 w-full" />

                <button className="text-nowrap" onClick={handleClicked}>
                    식사 업로드
                </button>
            </div>

            <input
                ref={inputRef}
                className="hidden"
                type="file"
                onInput={handleUpload}
            />
        </>
    );
}

export default UploadMenu;
