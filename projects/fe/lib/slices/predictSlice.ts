import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/../lib/store";

export interface PredictResult {
    id?: number;
    carbo?: number;
    fat?: number;
    foodLensId?: number[];
    foodName?: string;
    gram?: number;
    kcal?: number;
    protein?: number;
    sodium?: number;
}

export interface FoodList {
    id: number;
    foodname: string;
    manufacturer: string;
    predict_key: string;
}

export interface PredictList {
    foodlist: FoodList[];
    keyname: string;
    possibility: number;
}

// Define a type for the slice state
export interface PredictState {
    fileUrl: string;
    predictlist?: PredictList[];
    predictresult?: PredictResult;
}

// Define the initial state using that type
const initialState: PredictState = {
    fileUrl: "",
    predictlist: [],
    predictresult: {},
};

export const predictSlice = createSlice({
    name: "predict",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setFileUrl: (state, action: PayloadAction<string>) => {
            state.fileUrl = action.payload;
        },

        setPredict: (state, action: PayloadAction<PredictState>) => {
            state.fileUrl = action.payload.fileUrl;
            state.predictlist = action.payload.predictlist;
        },

        setPredictResult: (state, action: PayloadAction<PredictResult>) => {
            state.predictresult = action.payload;
        },
    },
});

export const { setFileUrl, setPredict, setPredictResult } =
    predictSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPredict = (state: RootState) => state.predict;
export const selectPredictResult = (state: RootState) => state.predict.predictresult;

export default predictSlice.reducer;
