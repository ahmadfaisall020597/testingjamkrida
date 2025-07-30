// redux/actions/languageActions.js
import { getLanguage, uploadLanguageFile, exportLanguageFile } from "../../utils/api/apiGlobal";
import { setLanguage, setDiffPreview } from "./languageSlice";

export const fnGetLanguage = (langCode) => async (dispatch) => {
    try {
        const res = await getLanguage(langCode);
        const translationData = res.data;

        dispatch(setLanguage({ langCode, translationData }));

        window.location.reload();
    } catch (err) {
        console.error("Error :", err);
    }
};

export const compareAndUploadLanguage = (language, file) => async (dispatch) => {
    try {
        const existing = await exportLanguageFile(language);
        const existingJson = existing.data;

        const newFileText = await file.text();
        const newJson = JSON.parse(newFileText);

        const oldKeys = Object.keys(existingJson);
        const newKeys = Object.keys(newJson);

        const missingKeys = oldKeys.filter(k => !newKeys.includes(k));

        if (missingKeys.length > 0) {
            dispatch(setDiffPreview({
                language,
                differences: missingKeys.map(k => ({
                    type: 'missing',
                    key: k,
                    oldValue: existingJson[k]
                }))
            }));

            alert(`File ${language.toUpperCase()} tidak valid karena ada key lama yang hilang.`);
            return;
        }

        const formData = new FormData();
        formData.append('language', language);
        formData.append('file', file);

        await uploadLanguageFile(formData);

        alert(`Upload ${language.toUpperCase()} berhasil`);
        dispatch(setDiffPreview(null));
    } catch (err) {
        console.error(err);
        alert(`Upload ${language.toUpperCase()} gagal`);
    }
};

export const downloadLanguageFile = (lang) => async () => {
    try {
        const response = await exportLanguageFile(lang);

        const jsonString = JSON.stringify(response.data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${lang}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.error(err);
        alert(`Export ${lang.toUpperCase()} gagal`);
    }
};

