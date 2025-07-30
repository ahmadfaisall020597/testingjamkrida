import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack, Image, Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputImageComponent from "src/components/partial/inputImageComponent";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
//import { fnStoreRoom } from "./roomFn";
import { History } from "src/utils/router";
import { toast } from "react-toastify";
import { formatNumberWithThousandSeparator, removeThousandSeparator } from "src/utils/helpersFunction";
import { fnGetListProdukPenjaminan, fnStorePenjaminan } from "./penjaminanFn";
import logoMitra from "src/assets/image/logo-bank-bsi.png";
import imageSK from "src/assets/image/syarat-dan-ketentuan-bsi.webp";
import InputDateComponent from "src/components/partial/inputDateComponent";
import { Link, useNavigate, useParams } from "react-router";
import objectRouter from "src/utils/router/objectRouter";
import { getLogoPath, getMitraName } from "src/utils/getLogoByEmail";
import { show as getDetailPenjaminan } from "../../../utils/api/apiPenjaminan";

//sementara
import FileTemplate from "src/assets/file/Formulir_Permohonan_Penjaminan_Kredit.docx";
import InputFileComponent from "../../../components/partial/InputFileComponent";
import { useLocation } from "react-router";
import { store } from "../../../utils/store/combineReducers";
import { setShowLoadingScreen } from "../../../utils/store/globalSlice";
import PreviewLampiranGroupComponent from "../../../components/partial/previewLampiranGroupComponent";
import { getEntitasName } from "../../../utils/getLogoByEmail";

/**
 * The CreateRoom component allows users to create a new room with specific attributes.
 * It initializes form data state and populates room type options from the redux store.
 * Users can input room details such as name, location, capacity, type, status, and upload an image.
 * The component validates form inputs before submission and handles form data submission to the server.
 * React hooks are utilized for managing form state and fetching room type data.
 */
const objectName = [
    "birthDate", //0
    "startDateCredit" //1
];
const listDataPIC = [
    { value: "Dian", label: "Dian" },
    { value: "Maulida", label: "Maulida" },
    { value: "Siska", label: "Siska" }
];
const listDataKota = [
    { value: "Jakarta Pusat", label: "Jakarta Pusat" },
    { value: "Jakarta Barat", label: "Jakarta Barat" },
    { value: "Jakarta Timur", label: "Jakarta Timur" },
    { value: "Jakarta Selatan", label: "Jakarta Selatan" },
    { value: "Jakarta Utara", label: "Jakarta Utara" },
    { value: "Kepulauan Seribu", label: "Kepulauan Seribu" }
];
const listDataJenisProduk = [
    { value: "Penjaminan Kredit Usaha Rakyat", label: "Penjaminan Kredit Usaha Rakyat" },
    { value: "Penjaminan Kredit Micro dan Kecil", label: "Penjaminan Kredit Micro dan Kecil" },
    { value: "Penjaminan Multiguna", label: "Penjaminan Multiguna" },
    { value: "Surety Bond", label: "Surety Bond" },
    { value: "Kontrak Bank Garansi", label: "Kontrak Bank Garansi" },
    { value: "Custom Bond", label: "Custom Bond" }
];
const listDataProduk = [{ value: "Surety Bond", label: "Surety Bond" }];
const listDataProvinsi = [{
    value: "DKI Jakarta", label: "DKI Jakarta"
}];
const listKotaJakarta = [
    {
        value: "Jakarta Pusat",
        label: "Jakarta Pusat",
        kecamatan: [
            {
                value: "Gambir",
                label: "Gambir",
                kelurahan: [
                    { value: "Gambir", label: "Gambir" },
                    { value: "Petojo Selatan", label: "Petojo Selatan" },
                    { value: "Petojo Utara", label: "Petojo Utara" },
                    { value: "Cideng", label: "Cideng" },
                    { value: "Duri Pulo", label: "Duri Pulo" }
                ]
            },
            {
                value: "Tanah Abang",
                label: "Tanah Abang",
                kelurahan: [
                    { value: "Kampung Bali", label: "Kampung Bali" },
                    { value: "Kebon Kacang", label: "Kebon Kacang" },
                    { value: "Kebon Melati", label: "Kebon Melati" }
                ]
            },
            {
                value: "Menteng",
                label: "Menteng",
                kelurahan: [
                    { value: "Menteng", label: "Menteng" },
                    { value: "Cikini", label: "Cikini" },
                    { value: "Kramat", label: "Kramat" },
                    { value: "Petojo Utara", label: "Petojo Utara" }
                ]
            }
        ]
    },
    {
        value: "Jakarta Barat",
        label: "Jakarta Barat",
        kecamatan: [
            {
                value: "Taman Sari",
                label: "Taman Sari",
                kelurahan: [
                    { value: "Mangga Besar", label: "Mangga Besar" },
                    { value: "Glodok", label: "Glodok" },
                    { value: "Pinangsia", label: "Pinangsia" },
                    { value: "Kampung Melayu", label: "Kampung Melayu" },
                    { value: "Kebon Kelapa", label: "Kebon Kelapa" }
                ]
            },
            {
                value: "Kebon Jeruk",
                label: "Kebon Jeruk",
                kelurahan: [
                    { value: "Kebon Jeruk", label: "Kebon Jeruk" },
                    { value: "Sukabumi Utara", label: "Sukabumi Utara" },
                    { value: "Sukabumi Selatan", label: "Sukabumi Selatan" },
                    { value: "Kedoya Selatan", label: "Kedoya Selatan" }
                ]
            },
            {
                value: "Cengkareng",
                label: "Cengkareng",
                kelurahan: [
                    { value: "Cengkareng Barat", label: "Cengkareng Barat" },
                    { value: "Cengkareng Timur", label: "Cengkareng Timur" },
                    { value: "Duri Kosambi", label: "Duri Kosambi" }
                ]
            },
            {
                value: "Kalideres",
                label: "Kalideres",
                kelurahan: [
                    { value: "Kalideres", label: "Kalideres" },
                    { value: "Pegadungan", label: "Pegadungan" },
                    { value: "Cengkareng Barat", label: "Cengkareng Barat" }
                ]
            },
            {
                value: "Kembangan",
                label: "Kembangan",
                kelurahan: [
                    { value: "Kembangan Selatan", label: "Kembangan Selatan" },
                    { value: "Kembangan Utara", label: "Kembangan Utara" },
                    { value: "Meruya Selatan", label: "Meruya Selatan" }
                ]
            },
            {
                value: "Palmerah",
                label: "Palmerah",
                kelurahan: [
                    { value: "Gelora", label: "Gelora" },
                    { value: "Palmerah", label: "Palmerah" }
                ]
            },
            {
                value: "Tambora",
                label: "Tambora",
                kelurahan: [
                    { value: "Angke", label: "Angke" },
                    { value: "Tambora", label: "Tambora" },
                    { value: "Jembatan Lima", label: "Jembatan Lima" }
                ]
            }
        ]
    },
    {
        value: "Jakarta Selatan",
        label: "Jakarta Selatan",
        kecamatan: [
            {
                value: "Kebayoran Baru",
                label: "Kebayoran Baru",
                kelurahan: [
                    { value: "Pondok Pinang", label: "Pondok Pinang" },
                    { value: "Rawa Barat", label: "Rawa Barat" },
                    { value: "Gandaria Utara", label: "Gandaria Utara" },
                    { value: "Kebayoran Lama Utara", label: "Kebayoran Lama Utara" },
                    { value: "Kebayoran Lama Selatan", label: "Kebayoran Lama Selatan" }
                ]
            },
            {
                value: "Pasar Minggu",
                label: "Pasar Minggu",
                kelurahan: [
                    { value: "Jati Padang", label: "Jati Padang" },
                    { value: "Pancoran", label: "Pancoran" },
                    { value: "Mampang Prapatan", label: "Mampang Prapatan" }
                ]
            },
            {
                value: "Cilandak",
                label: "Cilandak",
                kelurahan: [
                    { value: "Cilandak Barat", label: "Cilandak Barat" },
                    { value: "Cilandak Timur", label: "Cilandak Timur" },
                    { value: "Lebak Bulus", label: "Lebak Bulus" }
                ]
            }
        ]
    },
    {
        value: "Jakarta Timur",
        label: "Jakarta Timur",
        kecamatan: [
            {
                value: "Cakung",
                label: "Cakung",
                kelurahan: [
                    { value: "Jatinegara Kaum", label: "Jatinegara Kaum" },
                    { value: "Jatinegara Barat", label: "Jatinegara Barat" },
                    { value: "Utan Kayu Selatan", label: "Utan Kayu Selatan" },
                    { value: "Utan Kayu Utara", label: "Utan Kayu Utara" },
                    { value: "Bidara Cina", label: "Bidara Cina" }
                ]
            },
            {
                value: "Makasar",
                label: "Makasar",
                kelurahan: [
                    { value: "Makassar", label: "Makassar" },
                    { value: "Pondok Kopi", label: "Pondok Kopi" },
                    { value: "Mekarsari", label: "Mekarsari" },
                    { value: "Pinang Ranti", label: "Pinang Ranti" }
                ]
            },
            {
                value: "Kramat Jati",
                label: "Kramat Jati",
                kelurahan: [
                    { value: "Kramat Jati", label: "Kramat Jati" },
                    { value: "Cipinang", label: "Cipinang" },
                    { value: "Cipinang Melayu", label: "Cipinang Melayu" },
                    { value: "Balimester", label: "Balimester" }
                ]
            },
            {
                value: "Pulo Gadung",
                label: "Pulo Gadung",
                kelurahan: [
                    { value: "Pulo Gadung", label: "Pulo Gadung" },
                    { value: "Kayu Putih", label: "Kayu Putih" },
                    { value: "Klender", label: "Klender" }
                ]
            }
        ]
    },
    {
        value: "Jakarta Utara",
        label: "Jakarta Utara",
        kecamatan: [
            {
                value: "Kelapa Gading",
                label: "Kelapa Gading",
                kelurahan: [
                    { value: "Kelapa Gading Barat", label: "Kelapa Gading Barat" },
                    { value: "Kelapa Gading Timur", label: "Kelapa Gading Timur" },
                    { value: "Pegangsaan Dua", label: "Pegangsaan Dua" }
                ]
            },
            {
                value: "Pademangan",
                label: "Pademangan",
                kelurahan: [
                    { value: "Pademangan Barat", label: "Pademangan Barat" },
                    { value: "Pademangan Timur", label: "Pademangan Timur" }
                ]
            },
            {
                value: "Tanjung Priok",
                label: "Tanjung Priok",
                kelurahan: [
                    { value: "Tanjung Priok", label: "Tanjung Priok" },
                    { value: "Sungai Bambu", label: "Sungai Bambu" },
                    { value: "Warakas", label: "Warakas" }
                ]
            }
        ]
    },
    {
        value: "Kepulauan Seribu",
        label: "Kepulauan Seribu",
        kecamatan: [
            {
                value: "Kepulauan Seribu Utara",
                label: "Kepulauan Seribu Utara",
                kelurahan: [
                    { value: "Pulau Pramuka", label: "Pulau Pramuka" },
                    { value: "Pulau Panggang", label: "Pulau Panggang" },
                    { value: "Pulau Harapan", label: "Pulau Harapan" }
                ]
            },
            {
                value: "Kepulauan Seribu Selatan",
                label: "Kepulauan Seribu Selatan",
                kelurahan: [
                    { value: "Pulau Untung Jawa", label: "Pulau Untung Jawa" },
                    { value: "Pulau Kelapa", label: "Pulau Kelapa" },
                    { value: "Pulau Pari", label: "Pulau Pari" }
                ]
            }
        ]
    }
];

export default function DetailPenjaminan() {
    const navigate = useNavigate();
    const location = useLocation();
	const { id } = useParams();
    //const id = location.state?.id;
    //const type = location.state?.type;
    console.log("ID:", id);
    const [selectedKecamatan, setSelectedKecamatan] = useState([]);
    const [selectedKelurahan, setSelectedKelurahan] = useState([]);
    const [value, setValue] = useState("");
    const [valueNilaiPenjaminan, setValueNilaiPenjaminan] = useState("");
    const [valueNPWP, setValueNPWP] = useState("");
    const [formData, setFormData] = useState({
        pic: "",
        nik: 0,
        name: "",
        npwp: 0,
        noTelp: 0,
        tempatLahir: "",
        birthDate: Date,
        alamat: "",
        provinsi: "",
        kota: "",
        kecamatan: "",
        kelurahan: "",
        jenisProduk: "",
        plafonKredit: 0,
        nilaiPenjaminan: "",
        sukuBunga: 0,
        startDateCredit: Date,
        jangkaWaktu: 0,
        imageKTP: null,
        imageNPWP: null,
        imageSP: null,
        status: true,
        menyetujuiSK: false
    });
    const [lampiranList, setLampiranList] = useState([]);
    const penjaminanSelector = useSelector(state => state.penjaminan);
    // Validation rules (adjust the length as needed)
    const maxLength = {
        nik: 16,
        name: 256,
        tempatLahir: 100,
        noTelp: 13,
        alamat: 500
    };

    // Validate input length
    const validateInput = (key, value) => {
        // Only validate fields that have maxLength defined
        if (maxLength[key] !== undefined) {
            return value.length <= maxLength[key];
        }
        return true; // No validation needed for this field
    };
    // Handle change for form inputs
    const handleChange = (field, value) => {
        // Check if input is valid before updating
        if (!validateInput(field, value)) {
            console.warn(`Input for ${field} exceeds maximum length of ${maxLength[field]}`);
            return; // Prevent state update
        }
        setFormData(prev => {
            const updated = { ...prev, [field]: value };

            if (field === "provinsi") {
                updated.kota = "";
                updated.kecamatan = "";
                updated.kelurahan = "";
            } else if (field === "kota") {
                updated.kecamatan = "";
                updated.kelurahan = "";
            } else if (field === "kecamatan") {
                updated.kelurahan = "";
            }

            return updated;
        });
    };
    const handleCheckMenyetujuiSnk = value => {
        handleChange("menyetujuiSK", value);
    };
    useEffect(() => {
        store.dispatch(setShowLoadingScreen(true));
        fnGetListProdukPenjaminan();
        // getDetailPenjaminan(id, {hide_lampiran: true}).then(res => {
        getDetailPenjaminan(id).then(res => {
            console.log("detail penj res", res);
            setFormData({
                ...formData,
                nik: res.data.nik,
                name: res.data.nama,
                // npwp: res.data.npwp,
                noTelp: res.data.no_telp,
                tempatLahir: res.data.tmp_lahir,
                birthDate: res.data.tgl_lahir,
                alamat: res.data.alamat,
                provinsi: res.data.provinsi,
                kota: res.data.kota,
                kecamatan: res.data.kecamatan,
                kelurahan: res.data.kelurahan,
                jenisProduk: res.data.jenis_produk,
                // plafonKredit: res.data.plafon_kredit,
                // nilaiPenjaminan: res.data.nilai_penjaminan,
                sukuBunga: res.data.suku_bunga,
                startDateCredit: res.data.tgl_mulai_kredit,
                jangkaWaktu: res.data.jangka_waktu
            });
            setValueNPWP(res.data.npwp);
            setValue(res.data.plafon_kredit.toString());
            setValueNilaiPenjaminan(res.data.nilai_penjaminan.toString())
            setLampiranList(res.data.lampiran);
            store.dispatch(setShowLoadingScreen(false));
        }).catch(err => {
            console.log("detail penj err", err);
            store.dispatch(setShowLoadingScreen(false));
        });
    }, []);
    // useEffect(() => {
    //     const localData = JSON.parse(localStorage.getItem("dataPenjaminanMitra") || "[]");
    //     const foundData = localData.find(item => item.nomorPenjaminan?.toLowerCase() === id?.toLowerCase());
    //     console.log("foundData", foundData);
    //     if (foundData) {
    //         setFormData(prev => ({
    //             ...prev,
    //             ...foundData
    //         }));
    //         setValueNPWP(foundData.npwp);
    //         setValue(foundData.plafonKredit);
    //         setValueNilaiPenjaminan(foundData.nilaiPenjaminan);
    //     }

    // }, [id]); // Run when 'id' changes
    useEffect(() => {
        if (formData.kota) {
            // Reset Kecamatan and Kelurahan when Kota changes
            setSelectedKecamatan("");
            setSelectedKelurahan([]);
        }
    }, [formData.kota]);


    useEffect(() => {
        if (formData.kota) {
            const selectedCity = listKotaJakarta.find(kota => kota.value === formData.kota);
            const kecamatanList = selectedCity ? selectedCity.kecamatan : [];
            setSelectedKecamatan(kecamatanList);
        } else {
            setSelectedKecamatan([]);
        }
    }, [formData.kota]);

    const selectedCity = listKotaJakarta.find(kota => kota.value === formData.kota);
    const kecamatanList = selectedCity ? selectedCity.kecamatan : [];

    const kelurahanList = selectedKecamatan.find(kec => kec.value === formData.kecamatan)?.kelurahan || [];

    // Handle file input changes
    const handleFileChangeKTP = fileData => {
        if (fileData) {
            handleChange("imageKTP", fileData);
        } else {
            handleChange("imageKTP", null);
        }
    };
    const handleFileChangeNPWP = fileData => {
        if (fileData) {
            handleChange("imageNPWP", fileData);
        } else {
            handleChange("imageNPWP", null);
        }
    };
    const handleFileChangeSP = fileData => {
        if (fileData) {
            handleChange("imageSP", fileData);
        } else {
            handleChange("imageSP", null);
        }
    };

    // Validate the form before submitting
    const validateForm = () => {
        const { nik, name, npwp, noTelp, tempatLahir, alamat, nilaiPenjaminan } = formData;

        if (nilaiPenjaminan <= 0) {
            toast.error("Nilai Penjaminan must be greater than zero.");
            return false;
        }
        if (name.length > 256) {
            toast.error("Input Nama cannot exceed 256 characters."); // Show error if exceeds 16 digits
            return false;
        }
        if (tempatLahir.length > 100) {
            toast.error("Input Tempat Lahir cannot exceed 100 characters."); // Show error if exceeds 16 digits
            return false;
        }
        if (noTelp.length > 13) {
            toast.error("Input No.Telp cannot exceed 13 characters."); // Show error if exceeds 16 digits
            return false;
        }
        if (alamat.length > 500) {
            toast.error("Input Alamat cannot exceed 500 characters."); // Show error if exceeds 16 digits
            return false;
        }
        if (nik.length < 16) {
            toast.error("Input NIK cannot exceed 16 characters."); // Show error if exceeds 16 digits
            return false;
        } else if (nik.length > 16) {
            toast.error("Input NIK only 16 digits."); // Show error if exceeds 16 digits
            return false;
        }

        return true;
    };
    const formatRupiah = number => {
        // Remove any non-numeric characters except digits (to prepare the number for formatting)
        const numericValue = number.replace(/[^0-9]/g, "");

        // Format the numeric value as Rupiah currency
        const formattedValue = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(numericValue);

        return formattedValue;
    };

    const handleChangePlafon = e => {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/[^\d]/g, "");

        setValue(numericValue);
        setFormData(prev => ({ ...prev, plafonKredit: rawValue }));
    };
    
    const handleChangeNilaiPenjaminan = e => {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/[^\d]/g, "");

        setValueNilaiPenjaminan(numericValue);
        setFormData(prev => ({ ...prev, nilaiPenjaminan: rawValue }));
    };
    const formatNPWP = number => {
        // Remove any non-numeric characters
        const numericValue = number.replace(/[^0-9]/g, "");
        const limitedValue = numericValue.slice(0, 15);
        // Use substring to break the number into parts
        let formattedValue = limitedValue;

        // Insert periods after 2nd, 5th, and 8th digits
        if (formattedValue.length > 2) {
            formattedValue = formattedValue.substring(0, 2) + "." + formattedValue.substring(2);
        }
        if (formattedValue.length > 6) {
            formattedValue = formattedValue.substring(0, 6) + "." + formattedValue.substring(6);
        }
        if (formattedValue.length > 10) {
            formattedValue = formattedValue.substring(0, 10) + "." + formattedValue.substring(10);
        }

        //Insert hyphen after the 9th digit
        if (formattedValue.length > 12) {
            formattedValue = formattedValue.substring(0, 12) + "-" + formattedValue.substring(12);
        }

        // Insert hyphen after the 15th digit
        if (formattedValue.length > 16) {
            formattedValue = formattedValue.substring(0, 16) + "." + formattedValue.substring(16);
        }
        if (formattedValue.length > 20) {
            formattedValue = formattedValue.substring(0, 20) + "." + formattedValue.substring(20);
        }
        return formattedValue;
    };

    const handleChangeNPWPS = e => {
        const rawValue = e.target.value;

        // Update the state with the raw numeric value formatted as NPWP
        // If the length exceeds 20 characters, do not update the state (stop input)
        const numericValue = rawValue.replace(/[^0-9]/g, "");
        if (numericValue.length <= 15) {
            setValueNPWP(rawValue);
            setFormData(prev => ({ ...prev, npwp: rawValue })); // Update the state with the formatted NPWP value
        }
        setValueNPWP(rawValue);
        setFormData(prev => ({ ...prev, npwp: rawValue }));
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (!validateForm()) return;

        const existingData = JSON.parse(localStorage.getItem("dataPenjaminanMitra") || "[]");

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

        const newEntry = {
            nomorPenjaminan: `PJN${Date.now()}`,
            tglPengajuan: formattedDate,
            ...formData,
            status: "Processing"
        };

        const updatedData = [newEntry, ...existingData];
        localStorage.setItem("dataPenjaminanMitra", JSON.stringify(updatedData));

        toast.success("Data berhasil disimpan.");
        setTimeout(() => {
            navigate("/mitra/penjaminan-mitra");
        }, 1000);
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // logo
    const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
    const mitra_id  = dataLogin.data.mitra_id;

    const logoPath = getLogoPath(mitra_id);

    //nama mitra
    const mitraName = getMitraName(mitra_id);

    //nama entitas
    const entityName = getEntitasName(mitra_id);

    return (
			<>
				<Container fluid id="create-penjaminan-page">
					<Row>
						<CardComponent title="Create Penjaminan" type="create" needFooter>
							<Form onSubmit={handleSubmit}>
								<div className="form-header mb-4">
									<Row className="align-items-center">
										<Col xs={12} md={6} className="mb-3 mb-md-0">
											<div className="company-info">
												<h4 className="mb-2 text-primary">{mitraName}</h4>
												<h5 className="mb-1 text-secondary">B001</h5>
												<span className="text-muted">Jenis 1</span>
											</div>
										</Col>
										<Col xs={12} md={6} className="text-end">
											<Image src={logoPath} className="img-fluid" role="button" width={150} height={80} style={{ maxWidth: "100%", height: "auto" }} />
										</Col>
									</Row>
								</div>
								<br />
								<Row>
									<Col>
										<InputDropdownComponent
											readOnly
											listDropdown={listDataPIC}
											valueIndex
											label="PIC"
											required
											labelXl="3"
											value={formData.pic}
											name="PIC"
											onChange={e => handleChange("pic", e.target.value)}
											formGroupClassName="gx-3"
										/>
									</Col>
								</Row>
								<hr />
								<Row>
									<Col xs={12}>
										<h5 className="section-title mb-4 text-dark fw-bold">Data Pemohon</h5>
									</Col>
								</Row>
								<br />
								<Row>
									<Col>
										<InputComponent
											disabled
											type="number"
											label="NIK"
											labelXl="3"
											value={formData.nik}
											name="NIK"
											onChange={e => handleChange("nik", e.target.value)}
											required
											formGroupClassName="gx-2"
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputComponent
											disabled
											type="text"
											label="Nama"
											labelXl="3"
											value={formData.name}
											name="Nama"
											onChange={e => handleChange("name", e.target.value)}
											required
											formGroupClassName="gx-2"
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputComponent
											disabled
											type="text"
											label="No.NPWP"
											labelXl="3"
											value={formatNPWP(valueNPWP)}
											name="npwp"
											required
											onChange={handleChangeNPWPS}
											formGroupClassName="gx-2"
											placeholder={"00.000.000.0-000-000"}
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputComponent
											disabled
											type="number"
											label="No.Telp"
											labelXl="3"
											value={formData.noTelp}
											name="noTelp"
											onChange={e => handleChange("noTelp", e.target.value)}
											formGroupClassName="gx-2"
										/>
									</Col>
								</Row>
								<Row className="gx-2">
									<Col>
										<InputComponent
											disabled
											type="text"
											label="Tempat / Tgl Lhr"
											labelXl="6"
											value={formData.tempatLahir}
											name="tempatLahir"
											onChange={e => handleChange("tempatLahir", e.target.value)}
											formGroupClassName="gx-2"
										/>
									</Col>
									<Col>
										<InputDateComponent
											readOnly
											labelXl="12"
											customLabelFrom={""}
											formGroupClassName={"birthDate"}
											startDate={formData[objectName[0]]}
											onChangeStartDate={e => handleChange(objectName[0], e)}
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputComponent
											disabled
											type="textarea"
											rows="5"
											label="Alamat"
											labelXl="3"
											value={formData.alamat}
											name="alamat"
											onChange={e => handleChange("alamat", e.target.value)}
											formGroupClassName="gx-2"
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputDropdownComponent
											readOnly
											disabled={!formData.provinsi}
											listDropdown={!listDataProvinsi ? [] : [{ value: "", label: "-- Pilih Provinsi --" }, ...listDataProvinsi]}
											valueIndex
											label="Provinsi"
											labelXl="3"
											value={formData.provinsi}
											name="Provinsi"
											onChange={e => handleChange("provinsi", e.target.value)}
											formGroupClassName="gx-3"
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputDropdownComponent
											readOnly
											disabled={!formData.provinsi}
											listDropdown={!formData.provinsi ? [] : [{ value: "", label: "-- Pilih Kota --" }, ...listDataKota]}
											valueIndex
											label="Kota"
											labelXl="3"
											value={formData.kota}
											name="Kota"
											onChange={e => handleChange("kota", e.target.value)}
											formGroupClassName="gx-3"
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputDropdownComponent
											readOnly
											disabled={!formData.kota}
											listDropdown={!formData.kota ? [] : [{ value: "", label: "-- Pilih Kecamatan --" }, ...selectedKecamatan]}
											valueIndex
											label="Kecamatan"
											labelXl="3"
											value={formData.kecamatan}
											name="Kecamatan"
											onChange={e => handleChange("kecamatan", e.target.value)}
											formGroupClassName="gx-3"
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputDropdownComponent
											readOnly
											disabled={!formData.kecamatan}
											listDropdown={!formData.kecamatan ? [] : [{ value: "", label: "-- Pilih Kelurahan --" }, ...kelurahanList]}
											valueIndex
											label="Kelurahan"
											labelXl="3"
											value={formData.kelurahan}
											name="Kelurahan"
											onChange={e => handleChange("kelurahan", e.target.value)}
											formGroupClassName="gx-3"
										/>
									</Col>
								</Row>
								<br />
								<Row>
									<Col xs={12}>
										<h5 className="section-title mb-4 text-dark fw-bold">Data Kredit</h5>
									</Col>
								</Row>
								<br />
								<Row>
									<Col>
										<InputDropdownComponent
											readOnly
											disabled={!formData.jenisProduk}
											/* listDropdown={!listDataJenisProduk ? [] : [{ value: "", label: "-- Pilih Jenis Produk --" }, ...listDataJenisProduk] }*/
                                            listDropdown={penjaminanSelector.listProduk.length > 0 ? penjaminanSelector.listProduk : []}
											valueIndex
											label="Jenis Produk"
											labelXl="3"
											value={formData.jenisProduk}
											name="jenisProduk"
											onChange={e => handleChange("jenisProduk", e.target.value)}
											formGroupClassName="gx-3"
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputComponent
											disabled
											type="text"
											label="Plafon Kredit"
											labelXl="3"
											value={formatRupiah(value)}
											name="plafonKredit"
											onChange={handleChangePlafon}
											formGroupClassName="gx-2"
											placeholder={"Rp 0"}
										/>
									</Col>
								</Row>
								<Row>
									<Col>
										<InputComponent
											disabled
											type="text"
											label="Nilai Penjaminan"
											labelXl="3"
											value={formatRupiah(valueNilaiPenjaminan)}
											name="nilaiPenjaminan"
											onChange={handleChangeNilaiPenjaminan}
											formGroupClassName="gx-2"
											placeholder={"0"}
										/>
									</Col>
								</Row>
								<Row>
									<Col lg={12}>
										<div style={{ position: "relative" }}>
											<InputComponent
												type="number"
												label="Suku Bunga"
												labelXl="3"
												value={formData.sukuBunga}
												name="sukuBunga"
												onChange={e => handleChange("sukuBunga", e.target.value)}
												formGroupClassName="gx-2"
												placeholder="0"
												style={{ paddingRight: "40px" }}
												disabled
											/>
											<span
												className="position-absolute fw-bold text-muted"
												style={{
													right: "15px",
													top: "50%",
													transform: "translateY(-50%)",
							    						zIndex: 10
												}}
											>
												%
											</span>
										</div>
									</Col>
								</Row>
								<Row className="g-2 align-items-center">
									<Col xs={12} sm={4} md={3}>
										<div>Tgl Mulai Kredit</div>
									</Col>
									<Col xs={12} sm={8} md={9}>
										<div style={{ width: "100%" }}>
											<InputDateComponent
												labelXl="12"
												customLabelFrom={""}
												formGroupClassName={"startDateCredit"}
												value={formData.startDateCredit}
												onChangeStartDate={e => handleChange(objectName[1], e)}
											    readOnly
                                            />
										</div>
									</Col>
								</Row>
								<Row>
									<Col lg={7}>
										<InputComponent
											disabled
											style={{ marginLeft: "10px" }}
											type="number"
											label="Jangka Waktu"
											labelXl="5"
											value={formData.jangkaWaktu}
											name="jangkaWaktu"
											onChange={e => handleChange("jangkaWaktu", e.target.value)}
											formGroupClassName="gx-2"
											placeholder={"0"}
										/>
									</Col>
									<Col lg={2}>Bulan</Col>
								</Row>
								<br />
								<div className="form-section mb-4">
									<Row>
										<Col xs={12}>
											<h5 className="section-title mb-4 text-dark fw-bold">Lampiran Dokumen</h5>
										</Col>
									</Row>
                                    <Row className="mb-3">
                                        <Col xs={12}>
                                            <PreviewLampiranGroupComponent
                                                key="penjaminanPreview"
                                                mitra={entityName}
                                                page="penjaminan"
                                                jenisProduk={formData.jenisProduk}
                                                listData={lampiranList}
                                            />
                                        </Col>
                                    </Row>

									{/* <Row className="mb-3">
										<Col xs={12}>
											<div className="card border-0 shadow-sm">
												<div className="card-header bg-primary text-white py-2">
													<div className="d-flex align-items-center">
														<i className="fas fa-id-card me-2"></i>
														<strong>Kartu Tanda Penduduk (KTP)</strong>
													</div>
												</div>
												<div className="card-body">
													<InputImageComponent
														type="file"
														label="Pilih file KTP"
														labelXl="12"
														value={formData.imageKTP}
														name="imageKTP"
														onChange={handleFileChangeKTP}
														formGroupClassName="gx-2"
														showImagePreview
														controlId="formImageKTPCreatePenjaminan"
													/>
												</div>
											</div>
										</Col>
									</Row> */}

									{/* <Row className="mb-3">
										<Col xs={12}>
											<div className="card border-0 shadow-sm">
												<div className="card-header bg-success text-white py-2">
													<div className="d-flex align-items-center">
														<i className="fas fa-file-invoice me-2"></i>
														<strong>Nomor Pokok Wajib Pajak (NPWP)</strong>
													</div>
												</div>
												<div className="card-body">
													<InputImageComponent
														type="file"
														label="Pilih file NPWP"
														labelXl="12"
														value={formData.imageNPWP}
														name="imageNPWP"
														onChange={handleFileChangeNPWP}
														formGroupClassName="gx-2"
														showImagePreview
														controlId="formImageNPWPCreatePenjaminan"
													/>
												</div>
											</div>
										</Col>
									</Row> */}

									{/* <Row className="mb-3">
										<Col xs={12}>
											<div className="card border-0 shadow-sm">
												<div className="card-header bg-info text-white py-2">
													<div className="d-flex align-items-center">
														<i className="fas fa-envelope me-2"></i>
														<strong>Surat Permohonan</strong>
													</div>
												</div>
												<div className="card-body">
													<InputFileComponent
														type="file"
														label="Pilih file Surat Permohonan"
														labelXl="12"
														value={formData.imageSP}
														name="imageSP"
														onChange={handleFileChangeSP}
														formGroupClassName="gx-2"
														downloadTemplate={FileTemplate}
														showImagePreview
														controlId="formImageSPCreatePenjaminan"
													/>
												</div>
											</div>
										</Col>
									</Row> */}
								</div>

								{/* <div className="form-section mb-4">
									<Row>
										<Col xs={12}>
											<div className="d-flex align-items-start gap-3 p-3 bg-light rounded">
												<Form.Check type="checkbox" className="mt-1" checked={formData.menyetujuiSK === true} onChange={() => handleCheckMenyetujuiSnk(!formData.menyetujuiSK)} />
												<div className="flex-grow-1">
													<p className="m-0 text-muted">
														Saya setuju dengan{" "}
														<b>
															<Link onClick={handleShow} className="text-primary">
																Syarat dan Ketentuan
															</Link>
														</b>{" "}
														yang berlaku.
													</p>
												</div>
											</div>
										</Col>
									</Row>
								</div> */}
								<div className="form-actions">
									<Row>
										<Col xs={12}>
											<Stack direction="horizontal" className="justify-content-end flex-wrap" gap={3}>
												<ButtonComponent
													className="px-4 py-2 fw-semibold order-2 order-sm-1"
													variant="outline-danger"
													onClick={() => History.navigate(objectRouter.penjaminanMitraPage.path)}
													title="Close"
												/>
											</Stack>
										</Col>
									</Row>
								</div>
							</Form>
						</CardComponent>
					</Row>
				</Container>

				<Modal show={show}>
					<Modal.Header>
						<Modal.Title>Syarat dan Ketentuan</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Image src={imageSK} className="h-100" role="button" />
					</Modal.Body>
					<Modal.Footer>
						<ButtonComponent onClick={handleClose} title={"Saya Mengerti"} />
					</Modal.Footer>
				</Modal>
			</>
		);
}
