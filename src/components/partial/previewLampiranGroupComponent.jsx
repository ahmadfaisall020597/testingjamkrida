import { Row, Col } from "react-bootstrap";
import InputImageComponent from "src/components/partial/inputImageComponent";
import InputFileComponent from "src/components/partial/InputFileComponent";
import { useEffect } from "react";

const PreviewLampiranGroupComponent = ({
    key,
    mitra,
    page,
    jenisProduk,
    listData = []
}) => {
    useEffect(() => {
        console.log("preview mapval", listData);
    }, [listData]);

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

    const listRenderLampiran = listData.length > 0 ? listData.map((value) => {
        let bgColor = "primary";
        if(value.value !== "ktp" && value.value !== "srtp"){
            switch(value.value) {
                case "npwp":
                    bgColor = "success";
                    break;
                default:
                    bgColor = "secondary";
            }
        }
        return {
            documentName: value.value,
            placeholder: value.label,
            documentLabel: "File " + value.label,
            background: bgColor,
            fileType: value.file_info?.startsWith("data:image") ? "image" : "file",
            data: value.file_info,
            fileName: value.file_name
        };
    }) : [];

    return listRenderLampiran.map((value) => {
        console.log("map val", value);
        return (
            <div className="card border-0 shadow-sm">
                <div className={"card-header text-white py-2 bg-" + value.background}>
                    <div className="d-flex align-items=center">
                        <strong>{value.placeholder}</strong>
                    </div>
                </div>
                <div className="card-body">
                    {value.fileType === "image" && (
                        <InputImageComponent
                            type="file"
                            label={value.documentLabel}
                            termsConditionText=""
                            labelX1="12"
                            value={value.data}
                            fileBase64Name={value.fileName}
                            readOnly
                            formGroupClassName="gx-2"
                            showImagePreview
                            fileIsBase64
                        />
                    )}
                    {value.fileType === "file" && (
                        <InputFileComponent
                            type="file"
                            label={value.documentLabel}
                            hideBrowseButton
                            termsConditionText=""
                            labelX1="12"
                            value={value.data}
                            fileBase64Name={value.fileName}
                            readOnly
                            formGroupClassName="gx-2"
                            fileIsBase64
                        />
                    )}
                </div>
            </div>
        );
    })

};

export default PreviewLampiranGroupComponent;