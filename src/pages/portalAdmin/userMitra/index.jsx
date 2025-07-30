/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Col, Container, Modal, Row, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import CardComponent from "src/components/partial/cardComponent";
import { getOrderHistoryByIDIframe } from "src/utils/api/apiTransaction";
import { setShowLoadingScreen } from "src/utils/store/globalSlice";
import TablelUserMitra from "./module/tablelUserMitra";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { objectRouterPortalAdmin } from "src/utils/router/objectRouter.portalAdmin";
import ButtonComponent from "src/components/partial/buttonComponent";
import { dataDummyUserMitra } from "./dataDummyUserMitra";
// import "./style.scss";
import TableComponent from "src/components/partial/tableComponent";
import { getlisttUserMitrabyRole, getlistUserMitra, updateUserMitraStatus } from "../../../utils/api/apiUserMitra";
import { fnStoreUpdateStatusUserMitra } from "./userMitraFn";
import { getLogoPath, getMitraName } from "../../../utils/getLogoByEmail";

const UserMitraPage = () => {
    let [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userMitraList, setUserMitraList] = useState([]);
    const [userMitraBackupList, setUserMitraBackupList] = useState([]);
    const [dataCombined, setDataCombined] = useState([]);
    const [showOrderPreview, setShowOrderPreview] = useState(false);
    const [dataDetailPerSequence, setDataDetailPerSequence] = useState(null);
    const [filteredDatas, setFilteredDatas] = useState([]);
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);
    const [data, setData] = useState([
        { ID: "BSI", NAME: 'Admin BSI 1', EMAIL: "admin1@bsi.co.id", STATUS: "Active", },
        { ID: "BSI", NAME: 'Admin BSI 2', EMAIL: "admin2@bsi.co.id", STATUS: "Inactive", },
        { ID: "BSI", NAME: 'Admin BSI 3 ', EMAIL: "admin3@bsi.co.id", STATUS: "Active", },
        { ID: "MPN", NAME: 'Admin MPN 1 ', EMAIL: "admin1@mpn.co.id", STATUS: "Inactive", },
        { ID: "MPN", NAME: 'Admin MPN 2 ', EMAIL: "admin2@mpn.co.id", STATUS: "Inactive", },
        { ID: "MPN", NAME: 'Admin MPN 3 ', EMAIL: "admin3@mpn.co.id", STATUS: "Active", },
        { ID: "MPN", NAME: 'Admin MPN 4 ', EMAIL: "admin4@mpn.co.id", STATUS: "Inactive", },
        { ID: "MPN", NAME: 'Admin MPN 5 ', EMAIL: "admin5@mpn.co.id", STATUS: "Inactive", },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [sortObject, setSortObject] = useState({
        sortBy: "",
        order: "asc"
    });

    const [currentSearch, setCurrentSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(false);
    const debounceSearchRef = useRef(null);
    const perPage = 10
    const [selectedUser, setSelectedUser] = useState(null);

    //
    const { translationData } = useSelector(state => state.language);
    const code_lang = useSelector(state => state.language.selectedLanguage);
    console.log('translate bahasa : ', translationData[code_lang]);

    const handleClose = () => setShow(false);
    const handleShow = (user) => {
        setSelectedUser(user);
        setShow(true);
    };

    useEffect(() => {
        fetchUserMitraData();
    }, []); // fetch once on mount

    const fetchUserMitraData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getlisttUserMitrabyRole();
            if (Array.isArray(response.data.data)) {
                setUserMitraList(response.data.data);
                setUserMitraBackupList(response.data.data);
            } else {
                console.error("Response data is not an array:", response.data.data);
                setError("Format data tidak valid");
                setUserMitraList([]);
            }
        } catch (err) {
            console.error("Error fetching mitra data:", err);
            setError("Gagal memuat data mitra");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (row) => {
        setShowOrderPreview(true)
        setDataDetailPerSequence(row)
    }

    const handleSearch = (e, from) => {
        const searchValue = e.target.value;
        setCurrentSearch(searchValue);

        if (from === "onchange") {
            if (searchValue.trim() === "") {
                // Reset to full list when input is cleared
                setUserMitraList(userMitraBackupList);
            } else {
                const filtered = userMitraList.filter((item) =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.status.toLowerCase().includes(searchValue.toLowerCase())
                );
                setUserMitraList(filtered);
            }
        } else {
            setCurrentPage(1);
            setSearchTerm(searchValue);
        }
    };
    const handleConfirmToggleStatus = () => {
        if (!selectedUser) return;

        // Call your update API here, e.g. updateUserMitra(selectedUser.user_id, { status: updatedStatus })
        const updatedStatus = selectedUser.status === "Active" ? "Inactive" : "Active";

        const payload = {
            status: updatedStatus
        };

        fnStoreUpdateStatusUserMitra(selectedUser.user_id, payload);
        fetchUserMitraData();
        setShow(false);
    };

    const columns = [
        {
            name: "Mitra",
            selector: row => row.mitra_id,
            // width: "100%",
            sortable: true
        },
        {
            name: "Name",
            selector: row => row.name,
            // width: "100%",
            sortable: true
        },
        {
            name: "Email",
            selector: row => row.email,
            // width: "100%",
            sortable: true,
            wrap: true
        },
        {
            name: "Status",
            selector: row => row.status,
            //width: "120px",
            sortable: true,
            cell: row => {
                // Default badge color
                let badgeColor = "secondary";
                let badgeText = row.status;

                if (row.status === "Inactive") {
                    badgeColor = "danger";
                } else if (row.status === "Active") {
                    badgeColor = "success";
                }

                return (
                    <Badge pill bg={badgeColor} style={{ fontSize: "12px", padding: "5px 10px", color: "#fff" }}>
                        {badgeText}
                    </Badge>
                );
            }
        },
        {
            name: "Action",
            cell: row => (
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", minWidth: 80 }}>
                    <FaEdit style={{ cursor: "pointer", color: "orange", width: 20, height: 20 }} title="View" onClick={() => navigate(`/portal-admin/user-mitra/edit/${row.user_id}`)} />
                    {/* <FaTrash style={{ cursor: "pointer", color: "red", width: 20, height: 20 }} title="View" onClick={() => onViewDetail(row)} /> */}
                    <span
                        style={{ cursor: "pointer", color: "blue", textDecoration: "underline", fontSize: "13px" }}
                        onClick={() => handleShow(row)}
                    >
                        {row.status === "Active" ? "Inactive" : "Active"}
                    </span>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            Alignment: "center"
        }
    ];

    const customStyles = {
        // header: {
        //   style: {
        //     background: '#EBF451',
        //     color: '#333333',
        //     fontSize: '18px',
        //     fontWeight: 'bold',
        //     textAlign: 'center'
        //   },
        // },
        headCells: {
            style: {
                textAlign: "center",
                background: "#EBF451",
                color: "#333333",
                fontWeight: "bold"
            }
        },
        rows: {
            style: {
                textAlign: "center",
                backgroundColor: "#f1f1f1"
            }
        },
        cells: {
            style: {
                textAlign: "center"
            }
        }
    };
    // logo
    const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
    // console.log("dataLogin :", dataLogin);
    // const { email } = dataLogin;
    // const logoPath = getLogoPath(email);

    //nama mitra
    // const mitraName = getMitraName(email);
    return (
        <><Container fluid id="user-mitra-page">
            <CardComponent
                title={translationData[code_lang]?.user_mitra?.text1}
                type="index"
            >
                <div className="content mt-3">
                    <Row>
                        <Col xl={3} md={6}>
                            <InputSearchComponent
                                label=""
                                value={currentSearch}
                                onChange={(e) => handleSearch(e, "onchange")}
                                placeholder="Search"
                                componentButton={<FaSearch />}
                                buttonOnclick={() => handleSearch(null, "button")}
                                formGroupClassName={"inputDescriptionValue"}
                                labelXl="12" />
                        </Col>
                        <Col xl={9} md={6} className="d-flex justify-content-end align-items-start">
                            <Stack direction="horizontal" gap={2}>
                                <ButtonComponent variant="success" title={translationData[code_lang]?.user_mitra?.verification?.btn_label} cursor={"pointer"} onClick={() => { navigate(`${objectRouterPortalAdmin.userMitraVerification.path}`); }} />
                                <ButtonComponent title={translationData[code_lang]?.user_mitra?.upload_excel?.btn_label} onClick={() => navigate(`${objectRouterPortalAdmin.uploadExcelUserMitra.path}`)} cursor={"pointer"} />
                                <ButtonComponent title={translationData[code_lang]?.user_mitra?.create?.btn_label} onClick={() => navigate(`${objectRouterPortalAdmin.createUserMitra.path}`)} cursor={"pointer"} />
                            </Stack>
                        </Col>
                    </Row>
                    {/* Table */}
                    <div style={{ marginTop: 30 }}>
                        <TableComponent columns={columns} data={userMitraList} pagination paginationTotalRow={userMitraList.length} customStyles={customStyles} />
                    </div>
                </div>
            </CardComponent>
        </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to set user <strong>{selectedUser?.name}</strong> to
                    <strong> {selectedUser?.status === "Active" ? "Inactive" : "Active"}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="outline-danger" title="Cancel" onClick={handleClose} />
                    <ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="warning" title="Confirm" onClick={handleConfirmToggleStatus} />
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UserMitraPage;
