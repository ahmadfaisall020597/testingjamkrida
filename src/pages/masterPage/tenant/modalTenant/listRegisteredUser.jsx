/* eslint-disable no-unused-vars */
import { Col, Row, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { FaSearch } from "react-icons/fa";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import TableComponent from "src/components/partial/tableComponent";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import ButtonComponent from "src/components/partial/buttonComponent";
import { setListRegisteredUser, setListUser, setShowModal } from "../TenantSlice";
import { getAllActiveUsers } from "src/utils/api/apiMasterPage";
import { toast } from "react-toastify";

export default function ModalContentListRegisteredUser({ tenantId, canEdit }) {
  const dispatch = useDispatch();
  const { listUser, listRegisteredUser } = useSelector((state) => state.tenant);
  const [tempListRegisteredUser, setTempListRegisteredUser] = useState([]);
  const [searchParams, setSearchParams] = useState({ fullName: "", email: "" });
  const [currentSearch, setCurrentSearch] = useState({ fullName: "", email: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ sortBy: "", order: "asc" });
  const debounceSearchRef = useRef(null);
  const perPage = 10;

  // Fetch User List
  const fetchData = useCallback(() => {
    setLoading(true);
    const params = {
      pageNumber: currentPage,
      pageSize: perPage,
      ...searchParams,
      sortBy: sortConfig.sortBy,
      order: sortConfig.order,
    };

    // Simulasi Fetch API
    getAllActiveUsers(params).then(res => {
      const filteredData = res.data.data.filter(user => !tempListRegisteredUser.some(r => r.USER_ID == user.id));
      setTotalRows(res.data.totalData - tempListRegisteredUser.length);
      dispatch(setListUser(filteredData));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [currentPage, dispatch, searchParams, sortConfig, tempListRegisteredUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(()=>{
    setTempListRegisteredUser(listRegisteredUser)
  },[listRegisteredUser])

  useEffect(() => {
    debounceSearchRef.current = _.debounce((field, value) => {
      setSearchParams((prev) => ({ ...prev, [field]: value }));
      setCurrentPage(1);
    }, 500);
  }, [searchParams]);

  const handleSearch = (e, field, from) => {
    if (from == "onchange") {
      setCurrentSearch((prev) => ({ ...prev, [field]: e.target.value }));
      debounceSearchRef.current(field, e.target.value);
    } else {
      setCurrentPage(1);
      setSearchParams(currentSearch);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSortConfig({ sortBy: column.sortField, order: sortDirection });
  };

  const handleAdd = (user) => {
    if (!tempListRegisteredUser.some((u) => u.USER_ID == user.id)) {
      const translate = {
        USER_ID: user.id,
        USER_NAME: user.fullname,
        EMAIL_ADDRESS: user.email,
        STATUS_USERID: user.isActive,
      }
      setTempListRegisteredUser([...tempListRegisteredUser, translate]);
    }else{
      toast.error("User already registered");
    }
  };

  const handleDelete = (user) => {
    setTempListRegisteredUser(tempListRegisteredUser.filter((u) => u.USER_ID != user.USER_ID));
  };

  const handleSubmit = () => {
    dispatch(setListRegisteredUser(tempListRegisteredUser));
    dispatch(setShowModal(false));
  };

  const handleCancel = () =>{
    setTempListRegisteredUser(listRegisteredUser)
    dispatch(setShowModal(false));
  }

  const columnsConfigMaster = [
    {
      name: "Email Address",
      selector: (row) => row.email || row.EMAIL_ADDRESS,
      sortable: false,
      sortField: "email",
      width: "150px",
      wrap: true,
    },
    {
      name: "Name",
      selector: (row) => row.fullname || row.USER_NAME,
      sortable: false,
      sortField: "fullname",
      width: "140px",
      wrap: true,
    },
    {
      name: "Badge ID",
      selector: (row) => row.id || row.USER_ID,
      sortable: false,
      sortField: "id",
      width: "130px",
    },
  ];

  const columnListUser = [...columnsConfigMaster, {
    name: "Action",
    cell: (row) => <ButtonComponent disabled={loading} onClick={() => handleAdd(row)} type="button" variant="primary" title="Add" className="text-white" rounded="2" />,
    width: "120px",
  }];

  const columnListRegisteredUser = [...columnsConfigMaster, {
    name: "Action",
    cell: (row) => <ButtonComponent disabled={loading} onClick={() => handleDelete(row)} type="button" variant="outline-danger" title="Delete" className="bg-white" rounded="2" />,
    width: "140px",
  }];

  return (
    <Row>
      <Col className="create-col border-end border-3" sm={6}>
        <Row className="mt-2">
          <Col xl={5} md={6}>
            <InputSearchComponent
              label="Name"
              value={currentSearch.fullName}
              onChange={(e) => handleSearch(e, "fullName", "onchange")}
              placeholder="Search name..."
              componentButton={<FaSearch />}
              buttonOnclick={() => handleSearch(null, "fullName", "button")}
              formGroupClassName="searchName"
              labelXl="12"
            />
          </Col>
          <Col xl={5} md={6}>
            <InputSearchComponent
              label="Email"
              value={currentSearch.email}
              onChange={(e) => handleSearch(e, "email", "onchange")}
              placeholder="Search Email..."
              componentButton={<FaSearch />}
              buttonOnclick={() => handleSearch(null, "email", "button")}
              formGroupClassName="searchEmail"
              labelXl="12"
            />
          </Col>
        </Row>
        <div>
          <TableComponent
            columns={canEdit ? columnListUser : columnsConfigMaster}
            data={listUser}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            paginationComponentOptions={{noRowsPerPage: true}}
            onChangePage={setCurrentPage}
            progressPending={loading}
            progressComponent={<LoadingSpinner color="secondary" />}
            sortServer
            onSort={handleSort}
            responsive
            striped
            persistTableHead
          />
        </div>
      </Col>
      <Col sm={6}>
        <Row className="row-modal-section-registered-user px-3 mb-3">
          <Col className="bg-warning">
            <h5 className="m-0 my-2 mx-2">Registered User</h5>
          </Col>
        </Row>
        <div>
          <TableComponent
            columns={canEdit ? columnListRegisteredUser: columnsConfigMaster}
            data={tempListRegisteredUser}
            responsive
            striped
            persistTableHead
            pagination
          />
        </div>
        {canEdit &&
          <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
            <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" title="Save" type="button" onClick={handleSubmit} />
            <ButtonComponent className="px-sm-5 fw-semibold" variant="outline-danger" onClick={handleCancel} title="Cancel" />
          </Stack>
        }
      </Col>
    </Row>
  );
}
