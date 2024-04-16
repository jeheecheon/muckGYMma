"use client";

import React from "react";
import { useAppSelector } from "@/../lib/hooks";
import { PredictResult, selectPredict } from "@/../lib/slices/predictSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

const dummyData: PredictResult = {
    id: 6,
    foodLensId: [779],
    foodName: "제육볶음",
    kcal: 186.19,
    carbo: 12.83,
    fat: 9.04,
    gram: 120.7,
    sodium: 466.86,
    protein: 13.8,
};

function Page() {
    const predict = useAppSelector(selectPredict);
    const router = useRouter();

    return (
        <>
            <div className="h-full">
                <p className="block mb-2 text-center text-white/90 mx-auto text-2xl">
                    분석 완료!
                </p>
                <Image
                    src={predict.fileUrl}
                    width={300}
                    height={300}
                    alt="food"
                    className="h-[30vh] mx-auto rounded-xl"
                />

                <p className="text-white/90 block mt-10 text-center px-5 text-xl text-balance">
                    영앙소 분석 결과입니다.
                </p>
                <div
                    className="bg-white/15 rounded-lg cursor-pointer px-2 w-[80vw] mx-auto text-white/90 backdrop-blur-lg
                    mt-2 py-1"
                >
                    <p className="block text-center text-xl text-fluorescent my-1">
                        {predict.predictresult?.foodName}
                    </p>
                    <p>칼로리: {predict.predictresult?.kcal}kcal</p>
                    <p>탄수화물: {predict.predictresult?.carbo}g</p>
                    <p>단백질: {predict.predictresult?.protein}g</p>
                    <p>지방: {predict.predictresult?.fat}g</p>
                    <p>나트륨: {predict.predictresult?.sodium}mg</p>
                </div>
            </div>
        </>
    );
}

export default Page;
