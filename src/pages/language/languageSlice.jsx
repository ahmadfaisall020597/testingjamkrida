import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedLanguage: localStorage.getItem('selectedLanguage') || 'id',
    translationData: JSON.parse(localStorage.getItem('translation_data')) || {},
    diffPreview: null
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage(state, action) {
            const { langCode, translationData } = action.payload;

            state.selectedLanguage = langCode;
            state.translationData = translationData;

            localStorage.setItem("selectedLanguage", langCode);
            localStorage.setItem("translation_data", JSON.stringify({ [langCode]: translationData }));
        },
        setDiffPreview: (state, action) => {
            state.diffPreview = action.payload;
        }
    }
});

export const { setLanguage, setDiffPreview  } = languageSlice.actions;

export default languageSlice.reducer;
