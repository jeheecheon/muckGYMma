import React from "react";
import Link from "next/link";
import UploadMeal from "./UploadMeal";

interface UploadMenuProps {
    className?: string;
    isVisible: boolean;
}

function UploadMenu({ className, isVisible }: UploadMenuProps) {
    return (
        <>
            <div
                className={`bg-app-bg shadow-xl text-app-font-4 font-semibold 
                text-base px-3 py-3 rounded-2xl transition-opacity duration-500
                flex flex-col items-start ${
                    isVisible ? "opacity-100" : "opacity-0"
                } ${className}`}
            >
                <Link href="/post/write" className="text-nowrap">
                    포스트 작성
                </Link>

                <div className="my-[6px] border-b-[1px] border-b-app-font-6 w-full" />

                <UploadMeal buttonContent="식단 업로드" />
            </div>
        </>
    );
}

export default UploadMenu;
