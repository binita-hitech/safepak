import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    Collapse,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    styled,
    TextField,
    Snackbar,
} from "@mui/material";
import { Add, ArrowForward, Close, FilterList } from "@mui/icons-material";
import httpclient from "../../Utils";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import TableComponent from "../../Components/TableComponent";
import EditDialog from "../../Components/EditDialog";
import DeleteDialog from "../../Components/DeleteDialog";
import useTokenRefresh from "../../Hooks/useTokenRefresh";
// import DeactivateDialog from "../DeactivateDialog";
// import ResetDialog from "../ResetDialog";
// import DeleteDialog from "../DeleteDialog";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const login = localStorage.getItem("login");
const loginData = JSON.parse(login);

const columns = [
    { id: "sn", name: "SN" },
    { id: "company_erply_id", name: "Company ID" },
    { id: "company_name", name: "Company Name" },
    { id: "company_email", name: "Email" },
    { id: "company_address", name: "Address" },
    { id: "company_phone", name: "Phone" },
    { id: "company_status", name: "Status" },
    { id: "actions", name: "Actions" },
];

const adminColumns = [
    { id: "userID", name: "ID" },
    { id: "company_erply_id", name: "First Name" },
    { id: "company_name", name: "Last Name" },
    { id: "company_status", name: "User Name" },
    { id: "UserLevel", name: "User Level" },
    { id: "userActive", name: "Active" },
]

const superOptions = [
    { id: "edit", name: "Edit", action: "handleEdit" },
    { id: "deactivate", name: "Deactivate", action: "handleDeactivate" },
    { id: "reset", name: "Reset Password", action: "handleResetPassword" },
    { id: "delete", name: "Delete", action: "handleDelete" },
];

const adminOptions = [
    { id: "edit", name: "Edit", action: "handleEdit" },
    { id: "reset", name: "Reset Password", action: "handleResetPassword" },
]

const FilteredBox = styled(Box)(({ theme }) => ({
    background: "#f9f9f9",
    padding: "5px 10px",
    borderRadius: "5px",
    "& p": {
        margin: "0",
        marginRight: "10px",
        display: "inline-block",
        background: "#dedede",
        borderRadius: "10px",
        padding: "2px 5px",
    },
    "& svg": {
        fontSize: "15px",
        cursor: "pointer",
        position: "relative",
        top: "3px",
        background: theme.palette.primary.dark,
        color: "#fff",
        borderRadius: "50%",
        padding: "2px",
        marginLeft: "2px",
    },
}));

const Header = styled("div")(({ theme }) => ({
    "& h1": {
        color: theme.palette.primary.dark,
        margin: "0",
    },
}));

const AddButton = styled(Button)(({ theme }) => ({
    marginLeft: "10px",
    "& svg": {
        fontSize: "15px",
    },
}));

const configRowPerPage = JSON.parse(localStorage.getItem("configRowPerPage"));



const Companies = (props) => {

    const { getTokenRefreshed: refresh, open: tokenOpen, setOpen: setTokenOpen, message: tokenMessage, messageState: tokenMessageState } = useTokenRefresh();

    const navigate = useNavigate();
    const [openResetDialog, setOpenResetDialog] = useState(false);
    const [viewDetails, setViewDetails] = useState({});
    const [openActiveDialog, setOpenActiveDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [rows, setRows] = useState([]);

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState("");

    const [loading, setLoading] = useState(false);
    const [direction, setDirection] = useState(false);
    const [currentColumn, setCurrentColumn] = useState("");
    const [page, setPage] = useState(1);
    const [from, setFrom] = useState(1);
    const [to, setTo] = useState(
        configRowPerPage && configRowPerPage
            ? configRowPerPage && configRowPerPage
            : 20
    );

    const [rowsPerPage, setRowsPerPage] = useState(
        configRowPerPage && configRowPerPage
            ? configRowPerPage && configRowPerPage
            : 20
    );
    const [total, setTotal] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);

    const [filterData, setFilterData] = useState({
        company_erply_id: "",
        company_name: "",
        company_status: "",
        remove: false,
    });

    const [submittedData, setSubmittedData] = useState({
        company_erply_id: "",
        company_name: "",
        company_status: "",
        submit: false,
    });

    // useEffect(() => {
    //   getAllUsers();
    // }, []);

    useEffect(() => {
        if (
            filterData.company_erply_id === "" &&
            filterData.company_name === "" &&
            filterData.company_status === ""
        ) {
            setSubmittedData({
                ...submittedData,
                submit: false,
            });
        }
        if (filterData.company_erply_id === " ") filterData.company_erply_id = "";
        if (filterData.company_name === " ") filterData.company_name = "";
        if (filterData.company_status === " ") filterData.company_status = "";

        filterData.remove === true && handleFilter();
    }, [filterData]);

    useEffect(() => {
        let userStorage = JSON.parse(localStorage.getItem("company_filter"));
        userStorage !== null && setFilterData(userStorage);

        userStorage == null
            ? getAllUsers()
            : userStorage.company_erply_id == "" &&
                userStorage.company_name == "" &&
                userStorage.company_status == "" &&

                userStorage.removed == false
                ? getAllUsers()
                : console.log("users!");
    }, []);

    const getAllUsers = () => {
        setLoading(true);
        httpclient.get(`companies?pagination=${rowsPerPage}`).then(({ data }) => {
            if (data.status === 200) {
                setRows(data.data);
                setTotal(data.meta.total);
                setRowsPerPage(parseInt(data.meta.per_page));
                setPage(data.meta.current_page);
                setFrom(data.meta.from);
                setTo(data.meta.to);
                setLoading(false);
            } else {
                setOpen(true);
                setMessage(data.message);
                setMessageState("error");
                setLoading(false);
            }

        }).catch((err) => {
            if (err.response.status === 401) {
                refresh();
                setOpen(tokenOpen);
                setMessage(tokenMessage);
                setMessageState("error");
            } else if (err.response.status === 422) {
                const errorMessages = Object.values(err.response.data.errors).flat();
                setOpen(true);
                setMessage(errorMessages);
                setMessageState("error");
                setLoading(false);
            } else if (err.response.status === 400) {
                const errorMessages = Object.values(err.response.data.errors).flat();
                setOpen(true);
                setMessage(errorMessages);
                setMessageState("error");
                setLoading(false);

            } else {
                setOpen(true);
                setMessage(err.response.message);
                setMessageState("error");
                setLoading(false);
            }
        })

    };

    const hadleFilterOpen = () => {
        setFilterOpen((prev) => !prev);
    };

    const handleChangeFilter = (e) => {
        const { name, value } = e.target;
        setFilterData({
            ...filterData,
            [name]: value,
            remove: false,
        });
    };

    const handleFilter = () => {
        setSubmittedData({
            ...submittedData,
            company_erply_id: filterData.company_erply_id,
            company_name: filterData.company_name,
            company_status: filterData.company_status,

            submit: true,
        });
        filterData.remove = true;
        localStorage.setItem("company_filter", JSON.stringify(filterData));
        setLoading(true);
        if (
            filterData.company_erply_id ||
            filterData.company_name ||
            filterData.company_status
        ) {
            httpclient
                .get(
                    `companies?filters[company_erply_id][$eq]=${filterData.company_erply_id}&filters[company_name][$contains]=${filterData.company_name}&filters[company_status][$eq]=${filterData.company_status}&pagination=${rowsPerPage}&page=${1}`
                )
                .then(({ data }) => {
                    if (data.status === 200) {
                        setRows(data.data);
                        setTotal(data.meta.total);
                        setRowsPerPage(data.meta.per_page);
                        setPage(data.meta.current_page);
                        setFrom(data.meta.from);
                        setTo(data.meta.to);
                        setLoading(false);
                    } else {
                        setOpen(true);
                        setMessage(data.message);
                        setMessageState("error");
                        setLoading(false);
                    }

                }).catch((err) => {
                    if (err.response.status === 401) {
                        refresh();
                        setOpen(tokenOpen);
                        setMessage(tokenMessage);
                        setMessageState("error");
                    } else if (err.response.status === 422) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);
                    } else if (err.response.status === 400) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);

                    } else {
                        setOpen(true);
                        setMessage(err.response.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })

        } else {
            getAllUsers();
        }
    };

    const handleRemove = (data) => {
        setFilterData({
            ...filterData,
            [data]: "",
            remove: true,
        });

        setSubmittedData({
            ...submittedData,
            [data]: "",
        });
    };

    const handleSort = (column) => {
        setDirection((prevDirection) => !prevDirection);
        setCurrentColumn(column);
        submittedData.submit
            ? httpclient
                .get(
                    `companies?filters[company_erply_id][$eq]=${filterData.company_erply_id}&filters[company_name][$contains]=${filterData.company_name}&filters[company_status][$eq]=${filterData.company_status}&sort_by=${column}&direction=${!direction ? "asc" : "desc"
                    }&pagination=${rowsPerPage}&page=${page}`
                )
                .then(({ data }) => {
                    if (data.status === 200) {
                        setRows(data.data);
                        setTotal(data.meta.total);
                        setRowsPerPage(parseInt(data.meta.per_page));
                        setPage(data.meta.current_page);
                        setFrom(data.meta.from);
                        setTo(data.meta.to);
                        setLoading(false);
                    } else {
                        setOpen(true);
                        setMessage(data.message);
                        setMessageState("error");
                        setLoading(false);
                    }

                }).catch((err) => {
                    if (err.response.status === 401) {
                        refresh();
                        setOpen(tokenOpen);
                        setMessage(tokenMessage);
                        setMessageState("error");
                    } else if (err.response.status === 422) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);
                    } else if (err.response.status === 400) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);

                    } else {
                        setOpen(true);
                        setMessage(err.response.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
            : httpclient
                .get(
                    `companies?sort_by=${column}&direction=${!direction ? "asc" : "desc"
                    }&pagination=${rowsPerPage}`
                )
                .then(({ data }) => {
                    if (data.status === 200) {
                        setRows(data.data);
                        setTotal(data.meta.total);
                        setRowsPerPage(parseInt(data.meta.per_page));
                        setPage(data.meta.current_page);
                        setFrom(data.meta.from);
                        setTo(data.meta.to);
                        setLoading(false);
                    } else {
                        setOpen(true);
                        setMessage(data.message);
                        setMessageState("error");
                        setLoading(false);
                    }

                }).catch((err) => {
                    if (err.response.status === 401) {
                        refresh();
                        setOpen(tokenOpen);
                        setMessage(tokenMessage);
                        setMessageState("error");
                    } else if (err.response.status === 422) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);
                    } else if (err.response.status === 400) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);

                    } else {
                        setOpen(true);
                        setMessage(err.response.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
    };

    const handleChangePage = (e, page) => {
        setLoading(true);
        submittedData.submit
            ? httpclient
                .get(
                    `companies?filters[company_erply_id][$eq]=${filterData.company_erply_id}&filters[company_name][$contains]=${filterData.company_name}&filters[company_status][$eq]=${filterData.company_status}&sort_by=${currentColumn}&direction=${direction ? "asc" : "desc"
                    }&pagination=${rowsPerPage}&page=${page}`
                )
                .then(({ data }) => {
                    if (data.status === 200) {
                        setRows(data.data);
                        setTotal(data.meta.total);
                        setRowsPerPage(parseInt(data.meta.per_page));
                        setPage(data.meta.current_page);
                        setFrom(data.meta.from);
                        setTo(data.meta.to);
                        setLoading(false);
                    } else {
                        setOpen(true);
                        setMessage(data.message);
                        setMessageState("error");
                        setLoading(false);
                    }

                }).catch((err) => {
                    if (err.response.status === 401) {
                        refresh();
                        setOpen(tokenOpen);
                        setMessage(tokenMessage);
                        setMessageState("error");
                    } else if (err.response.status === 422) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);
                    } else if (err.response.status === 400) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);

                    } else {
                        setOpen(true);
                        setMessage(err.response.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
            : httpclient
                .get(
                    `companies?direction=${direction ? "asc" : "desc"
                    }&pagination=${rowsPerPage}&page=${page}`
                )
                .then(({ data }) => {
                    if (data.status === 200) {
                        setRows(data.data);
                        setTotal(data.meta.total);
                        setRowsPerPage(parseInt(data.meta.per_page));
                        setPage(data.meta.current_page);
                        setFrom(data.meta.from);
                        setTo(data.meta.to);
                        setLoading(false);
                    } else {
                        setOpen(true);
                        setMessage(data.message);
                        setMessageState("error");
                        setLoading(false);
                    }

                }).catch((err) => {
                    if (err.response.status === 401) {
                        refresh();
                        setOpen(tokenOpen);
                        setMessage(tokenMessage);
                        setMessageState("error");
                    } else if (err.response.status === 422) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);
                    } else if (err.response.status === 400) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);

                    } else {
                        setOpen(true);
                        setMessage(err.response.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        // setLoading(true);

        localStorage.setItem("configRowPerPage", event.target.value);

        submittedData.submit
            ? httpclient
                .get(
                    `companies?filters[company_erply_id][$eq]=${filterData.company_erply_id}&filters[company_name][$contains]=${filterData.company_name}&filters[company_status][$eq]=${filterData.company_status}&sort_by=${currentColumn}&direction=${direction ? "asc" : "desc"
                    }&pagination=${+event.target.value}&page=${page}`
                )
                .then(({ data }) => {
                    setLoading(true);
                    if (data.status === 200) {
                        setRows(data.data);
                        setTotal(data.meta.total);
                        setRowsPerPage(parseInt(data.meta.per_page));
                        setPage(data.meta.current_page);
                        setFrom(data.meta.from);
                        setTo(data.meta.to);
                        setLoading(false);
                    } else {
                        setOpen(true);
                        setMessage(data.message);
                        setMessageState("error");
                        setLoading(false);
                    }

                }).catch((err) => {
                    if (err.response.status === 401) {
                        refresh();
                        setOpen(tokenOpen);
                        setMessage(tokenMessage);
                        setMessageState("error");
                    } else if (err.response.status === 422) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);
                    } else if (err.response.status === 400) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);

                    } else {
                        setOpen(true);
                        setMessage(err.response.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
            : httpclient
                .get(
                    `companies?direction=${direction ? "asc" : "desc"}&pagination=${+event
                        .target.value}&page=${1}`
                )
                .then(({ data }) => {
                    setLoading(true);
                    if (data.status === 200) {
                        setRows(data.data);
                        setTotal(data.meta.total);
                        setRowsPerPage(parseInt(data.meta.per_page));
                        setFrom(data.meta.from);
                        setTo(data.meta.to);
                        setPage(data.meta.current_page);
                        setLoading(false);
                    } else {
                        setOpen(true);
                        setMessage(data.message);
                        setMessageState("error");
                        setLoading(false);
                    }

                }).catch((err) => {
                    if (err.response.status === 401) {
                        refresh();
                        setOpen(tokenOpen);
                        setMessage(tokenMessage);
                        setMessageState("error");
                    } else if (err.response.status === 422) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);
                    } else if (err.response.status === 400) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);

                    } else {
                        setOpen(true);
                        setMessage(err.response.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
    };


    const handleAddNew = () => {
        setOpenEditDialog(true)
    };

    const handleEdit = (row) => {
        setOpenEditDialog(true)
        setViewDetails(row);
    };

    const sendEdit = (call, formData) => {
        if (call.open === false) {

            setOpenEditDialog(false);
            setViewDetails({});
        }
        if (call.success === true) {
            viewDetails.id ? (
                httpclient
                    .put(`companies/${viewDetails.id}`, formData)
                    .then(({ data }) => {
                        if (data.status === 200) {
                            setOpen(true);
                            setMessageState("success");
                            setMessage(data.message);
                            setOpenActiveDialog(false);
                            setViewDetails({});
                            getAllUsers();
                        }
                        else {
                            setOpen(true);
                            setMessage(data.message);
                            setMessageState("error");
                            setLoading(false);
                        }

                    }).catch((err) => {
                        if (err.response.status === 401) {
                            refresh();
                            setOpen(tokenOpen);
                            setMessage(tokenMessage);
                            setMessageState("error");
                        } else if (err.response.status === 422) {
                            const errorMessages = Object.values(err.response.data.errors).flat();
                            setOpen(true);
                            setMessage(errorMessages);
                            setMessageState("error");
                            setLoading(false);
                        } else if (err.response.status === 400) {
                            const errorMessages = Object.values(err.response.data.errors).flat();
                            setOpen(true);
                            setMessage(errorMessages);
                            setMessageState("error");
                            setLoading(false);

                        } else {
                            setOpen(true);
                            setMessage(err.response.message);
                            setMessageState("error");
                            setLoading(false);
                        }
                    })
            ) :
                httpclient
                    .post(`companies`, formData)
                    .then(({ data }) => {
                        if (data.status === 200) {
                            setOpen(true);
                            setMessageState("success");
                            setMessage(data.message);
                            setOpenActiveDialog(false);
                            setViewDetails({});
                            getAllUsers();
                        } else {
                            setOpen(true);
                            setMessage(data.message);
                            setMessageState("error");
                            setLoading(false);
                        }

                    }).catch((err) => {
                        if (err.response.status === 401) {
                            refresh();
                            setOpen(tokenOpen);
                            setMessage(tokenMessage);
                            setMessageState("error");
                        } else if (err.response.status === 422) {
                            const errorMessages = Object.values(err.response.data.errors).flat();
                            setOpen(true);
                            setMessage(errorMessages);
                            setMessageState("error");
                            setLoading(false);
                        } else if (err.response.status === 400) {
                            const errorMessages = Object.values(err.response.data.errors).flat();
                            setOpen(true);
                            setMessage(errorMessages);
                            setMessageState("error");
                            setLoading(false);

                        } else {
                            setOpen(true);
                            setMessage(err.response.message);
                            setMessageState("error");
                            setLoading(false);
                        }

                    })
        }
    };


    const handleDelete = (row) => {
        setOpenDeleteDialog(true);
        setViewDetails(row)
    };

    const sendDelete = (call, formData) => {
        if (call.open === false) {
            setOpenDeleteDialog(false)
            setViewDetails({})
        }
        if (call.success === true) {
            httpclient
                .delete(`companies/${viewDetails.id}`, formData)
                .then(({ data }) => {
                    if (data.status === 200) {
                        setOpen(true);
                        setMessageState("success");
                        setMessage(data.message);
                        setOpenDeleteDialog(false);
                        setViewDetails({});
                        getAllUsers();
                    } else {
                        setOpen(true);
                        setMessage(data.message);
                        setMessageState("error");
                        setLoading(false);
                    }

                }).catch((err) => {
                    if (err.response.status === 401) {
                        refresh();
                        setOpen(tokenOpen);
                        setMessage(tokenMessage);
                        setMessageState("error");
                    } else if (err.response.status === 422) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);
                    } else if (err.response.status === 400) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        setOpen(true);
                        setMessage(errorMessages);
                        setMessageState("error");
                        setLoading(false);

                    } else {
                        setOpen(true);
                        setMessage(err.response.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
        }
    }

    const currentChange = (value, row) => {

        if (value === "allow_update") {
            handleEdit(row);
        }

        if (value === "allow_delete") {
            handleDelete(row);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
        setTokenOpen(false);
    };

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item md={8} xs={12}>
                    <Header>
                        <h1>List Companies</h1>
                    </Header>
                </Grid>
                <Grid
                    item
                    md={4}
                    xs={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                >
                    <Button color="primary" variant="contained" onClick={hadleFilterOpen}>
                        Filter <FilterList style={{ marginLeft: "5px" }} fontSize="small" />
                    </Button>

                    {props.permissions.some((pre) => pre.name === "allow_create") &&
                        <AddButton
                            color="primary"
                            variant="contained"
                            onClick={handleAddNew}
                        >
                            <Add style={{ marginRight: "5px" }} fontSize="small" /> Add Company
                        </AddButton>
                    }
                </Grid>

                {/* Filter */}
                <Grid item xs={12}>
                    <Collapse in={filterOpen}>
                        <Card>
                            <Box p={4}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <InputLabel>Company Erply ID</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            name="company_erply_id"
                                            value={filterData.company_erply_id}
                                            onChange={handleChangeFilter}
                                            onKeyDown={e => { if (e.key === "Enter") handleFilter() }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <InputLabel>Company Name</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            name="company_name"
                                            value={filterData.company_name}
                                            onChange={handleChangeFilter}
                                            onKeyDown={e => { if (e.key === "Enter") handleFilter() }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <InputLabel>Status</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            name="company_status"
                                            value={filterData.company_status}
                                            onChange={handleChangeFilter}
                                            onKeyDown={e => { if (e.key === "Enter") handleFilter() }}
                                            fullWidth
                                        />
                                    </Grid>



                                    <Grid item xs={12}>
                                        <Box textAlign={"right"}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleFilter}
                                            >
                                                Filter{" "}
                                                <ArrowForward
                                                    fontSize="small"
                                                    style={{ marginLeft: "5px" }}
                                                />
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Collapse>
                </Grid>

                {submittedData.company_erply_id ||
                    submittedData.company_name ||
                    submittedData.company_status ? (
                    <Grid item xs={12}>
                        <FilteredBox>
                            <span>Filtered: </span>
                            {submittedData.company_erply_id && (
                                <p>
                                    <span>Company Erply ID: {submittedData.company_erply_id}</span>
                                    <Close
                                        fontSize="small"
                                        onClick={() => handleRemove("company_erply_id")}
                                    />
                                </p>
                            )}
                            {submittedData.company_name && (
                                <p>
                                    <span>Company Name: {submittedData.company_name}</span>
                                    <Close
                                        fontSize="small"
                                        onClick={() => handleRemove("company_name")}
                                    />
                                </p>
                            )}
                            {submittedData.company_status && (
                                <p>
                                    <span>Status: {submittedData.company_status}</span>
                                    <Close
                                        fontSize="small"
                                        onClick={() => handleRemove("company_status")}
                                    />
                                </p>
                            )}

                        </FilteredBox>
                    </Grid>
                ) : (
                    <Box></Box>
                )}
                {/* Filter */}

                <Grid item xs={12}>
                    <TableComponent
                        columns={columns}
                        rows={rows}
                        sort={true}
                        handleSort={handleSort}
                        props={props}
                        options={props?.permissions}
                        currentChange={currentChange}
                        loading={loading}
                        direction={direction}
                        currentColumn={currentColumn}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        handleChangePage={handleChangePage}
                        page={page}
                        total={total && total}
                        fromTable={from}
                        toTable={to}
                        rowsPerPage={rowsPerPage}
                    />
                </Grid>
            </Grid>



            {openDeleteDialog && <DeleteDialog viewDetails={viewDetails} sendDelete={sendDelete} />}

            {openEditDialog && (
                <EditDialog
                    viewDetails={viewDetails}
                    sendEdit={sendEdit}
                />
            )}

            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={open || tokenOpen}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={messageState || tokenMessageState}
                    sx={{ width: "100%" }}
                >
                    {message || tokenMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Companies;
