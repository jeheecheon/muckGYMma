"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useAppDispatch } from "@/../lib/hooks";
import { backendUrl } from "@/_utils/urls";
import { PredictState, setPredict } from "@/../lib/slices/predictSlice";
import EditImage from "@/_components/EditImage";
import {
    ORIENTATION_TO_ANGLE,
    getRotatedImage,
    readFile,
    urlToBlobFile,
} from "@/_utils/canvas";
import { getOrientation } from "get-orientation/browser";

interface UploadMealProps {
    className?: string;
    buttonContent: string | React.ReactNode;
    onClick?: () => void;
}

function UploadMeal({ className, buttonContent: buttonName, onClick = () => {} }: UploadMealProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    function handleClicked() {
        inputRef.current?.click();
    }

    async function onCrop(blob: string) {
        if (!blob) {
            console.error("No image data found.");
            return;
        }

        // URL로부터 Blob 데이터를 가져와서 File 객체로 변환하고 FormData에 추가하는 예제
        const file = await urlToBlobFile(blob, "image.jpg")
            .then((file) => {
                return file;
            })
            .catch((error) => {
                console.error("Error fetching blob from URL:", error);
                return null;
            });

        if (!file) {
            console.error("No file found.");
            return;
        }
        console.log("file: ", file);
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
                router.push(`/meal/prediction/pick`);
            })
            .catch((err) => console.error(err));
    }

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];
            console.log(file);

            const imageDataUrl = await readFile(file);

            if (typeof imageDataUrl === "string") {
                try {
                    // apply rotation if needed
                    const orientation = await getOrientation(file);
                    const rotation = ORIENTATION_TO_ANGLE[orientation];
                    if (rotation) {
                        const rotatedImageDataUrl = await getRotatedImage(
                            imageDataUrl,
                            rotation
                        );
                        setImageSrc(rotatedImageDataUrl);
                    } else {
                        setImageSrc(imageDataUrl);
                    }
                    setIsEditing(true);
                } catch (e) {
                    console.warn("failed to detect the orientation");
                    setImageSrc(imageDataUrl);
                    setIsEditing(true);
                }
            }
            e.target.value = "";
        } else {
            console.error("No file selected.");
        }
    };

    return (
        <>
            <button
                className={`text-nowrap ${className}`}
                onClick={() => {
                    handleClicked();
                    onClick();
                }}
            >
                {buttonName}
            </button>

            <input
                ref={inputRef}
                className="hidden"
                type="file"
                onInput={onFileChange}
            />

            {isEditing && (
                <EditImage
                    imageSrc={imageSrc!}
                    onCrop={onCrop}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    );
}

export default UploadMeal;
