import { useSelector } from "react-redux";
import InputLampiranItemComponent from "./inputLampiranItemComponent";
import { useEffect } from "react";
import { fnGetLampiranPenjaminan, fnResetLampiranMitra } from "../../pages/mitra/penjaminan/penjaminanFn";
import { fnGetNewLampiranClaim, fnGetRejectedLampiranClaim } from "../../pages/mitra/claim/claimFn";

const InputLampiranGroupComponent = ({
    key,
    mitra,
    page,
    jenisProduk,
    subPage="",
    existingLampiran=[]
}) => {
    // contoh response dari API
    const dummyResponse = [
        {
            value: "ktp",
            label: "Kartu Tanda Penduduk",
            detail: "Resolution image is 128x128 pixel with max. of 1 images only. Max. file size 2MB",
            type: "jpg"
        },
        {
            value: "npwp",
            label: "Nomor Pokok Wajib Pajak",
            detail: 'Resolution image is 128x128 pixel with max. of 1 images only. Max. file size 2MB',
            type: "jpg"
        }
    ];
    // mapping status lampiran detail
    const statusLampiranDtlMapping = [
        {
            key: "N",
            value: "Pending"
        },
        {
            key: "R",
            value: "Rejected"
        },
        {
            key: "default",
            value: "Not Uploaded"
        }
    ];
    const listLampiran = useSelector(state => state.penjaminan.uploadLampiranList);
    const shortDocumentName = ["ktp", "npwp", "skck"];

    const getFormType = extension => {
        const typeMapping = {
            jpg: "image",
            jpeg: "image",
            webp: "image",
            pdf: "file",
            docx: "file"
        };
        return typeMapping[extension.toLowerCase()] || "image";
    };

    // data untuk dioper ke component
    const listRenderLampiran = listLampiran.length > 0 ? listLampiran.map((value) => {
        let bgColor = "blue";
        let status = "";
        if(value.value !== "ktp" && value.value !== "srtp"){
            switch(value.value) {
                case "npwp":
                    bgColor = "green";
                    break;
                default:
                    bgColor = "";
            }
        }
        if(page === "claim" && subPage === "revisi-lampiran"){
            let statusSearch = value.status_doc ? value.status_doc : "default";
            const indexStatus = statusLampiranDtlMapping.findIndex(obj => obj.key === statusSearch);
            status = indexStatus !== -1 ? statusLampiranDtlMapping[indexStatus].value : "Not Set";
        }
        return {
            documentName: value.value,
            placeholder: value.label,
            documentLabel: "Pilih file " + value.label,
            background: bgColor,
            fileType: getFormType(value.type),
            status: status
        };
    }) : [];

    useEffect(() => {
        if(jenisProduk && mitra) {
            switch(page) {
                case "penjaminan":
                    fnGetLampiranPenjaminan(mitra, jenisProduk);
                    break;
                case "claim":
                    fnGetNewLampiranClaim(mitra, jenisProduk);
                    break;
                default:
                    fnResetLampiranMitra();
            }
        }
        else{
            if(page === "claim" && subPage === "revisi-lampiran") {
                // do nothing because the API call to change reducer already called in the view page
            }
            else fnResetLampiranMitra();
        }
    }, [mitra, page, jenisProduk, subPage]);

    if(page === "penjaminan"){
        return listRenderLampiran
			.sort((a, b) => a.documentName.localeCompare(b.documentName))
			.map(value => {
				return (
					<InputLampiranItemComponent
                        key={key + value.documentName}
                        page={page}
                        fileType={value.fileType}
                        documentName={value.documentName}
                        placeholder={value.placeholder}
                        documentLabel={value.documentLabel}
                        background={value.background}
                    />
                );
            });
    }
    else if(page === "claim"){
        return listRenderLampiran
			.sort((a, b) => a.documentName.localeCompare(b.documentName))
			.map(value => {
                const lampiranById = (Array.isArray(existingLampiran) &&
                    existingLampiran.length > 0) ?
                        existingLampiran.filter(obj => obj.value === value.documentName)
                        : [];
				return (
					<InputLampiranItemComponent
                        key={key + value.documentName}
                        page={page}
                        fileType={value.fileType}
                        documentName={value.documentName}
                        placeholder={value.placeholder}
                        documentLabel={value.documentLabel}
                        background={value.background}
                        additionalStatus={value.status}
                        existingLampiran={lampiranById}
                    />
                );
            });
    }
    else return null;
};

export default InputLampiranGroupComponent;
