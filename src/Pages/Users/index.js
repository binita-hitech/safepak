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
import EditDialogUser from "../../Components/EditDialogUser";
// import DeactivateDialog from "../DeactivateDialog";
// import ResetDialog from "../ResetDialog";
// import DeleteDialog from "../DeleteDialog";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const login = localStorage.getItem("login");
const loginData = JSON.parse(login);

const columns = [
    { id: "id", name: "ID" },
    // { id: "company_erply_id", name: "Company ID" },
    { id: "full_name", name: "Full Name" },
    { id: "email", name: "Email" },
    { id: "mobile", name: "Mobile" },
    { id: "role", name: "Role" },
    { id: "is_system_admin", name: "System Admin?" },
    { id: "actions", name: "Actions" },
];

const adminColumns = [
    { id: "userID", name: "ID" },
    { id: "company_erply_id", name: "First Name" },
    { id: "full_name", name: "Last Name" },
    { id: "mobile", name: "User Name" },
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



const Users = (props) => {

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
        full_name: "",
        mobile: "",
        remove: false,
    });

    const [submittedData, setSubmittedData] = useState({
        company_erply_id: "",
        full_name: "",
        mobile: "",
        submit: false,
    });

    // useEffect(() => {
    //   getAllUsers();
    // }, []);

    useEffect(() => {
        if (
            filterData.company_erply_id === "" &&
            filterData.full_name === "" &&
            filterData.mobile === ""
        ) {
            setSubmittedData({
                ...submittedData,
                submit: false,
            });
        }
        if (filterData.company_erply_id === " ") filterData.company_erply_id = "";
        if (filterData.full_name === " ") filterData.full_name = "";
        if (filterData.mobile === " ") filterData.mobile = "";

        filterData.remove === true && handleFilter();
    }, [filterData]);

    useEffect(() => {
        let userStorage = JSON.parse(localStorage.getItem("user_filter"));
        userStorage !== null && setFilterData(userStorage);

        userStorage == null
            ? getAllUsers()
            : userStorage.company_erply_id == "" &&
                userStorage.full_name == "" &&
                userStorage.mobile == "" &&

                userStorage.removed == false
                ? getAllUsers()
                : console.log("users!");
    }, []);

    const getAllUsers = () => {
        setLoading(true);
        httpclient.get(`admin-users?pagination=${rowsPerPage}`).then(({ data }) => {
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
                setMessage(err.response.data.message);
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
            full_name: filterData.full_name,
            mobile: filterData.mobile,

            submit: true,
        });
        filterData.remove = true;
        localStorage.setItem("user_filter", JSON.stringify(filterData));
        setLoading(true);
        if (
            filterData.company_erply_id ||
            filterData.full_name ||
            filterData.mobile
        ) {
            httpclient
                .get(
                    `admin-users?filters[full_name][$contains]=${filterData.full_name}&filters[mobile][$eq]=${filterData.mobile}&pagination=${rowsPerPage}&page=${1}`
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
                        setMessage(err.response.data.message);
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
                    `admin-users?filters[full_name][$contains]=${filterData.full_name}&filters[mobile][$eq]=${filterData.mobile}&sort[0]=${column}:${!direction ? "asc" : "desc"
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
                        setMessage(err.response.data.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
            : httpclient
                .get(
                    `admin-users?sort[0]=${column}:${!direction ? "asc" : "desc"
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
                        setMessage(err.response.data.message);
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
                    `admin-users?filters[full_name][$contains]=${filterData.full_name}&filters[mobile][$eq]=${filterData.mobile}&sort[0]=${currentColumn}:${!direction ? "asc" : "desc"
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
                        setMessage(err.response.data.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
            : httpclient
                .get(
                    `admin-users?pagination=${rowsPerPage}&page=${page}`
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
                        setMessage(err.response.data.message);
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
                    `admin-users?filters[full_name][$contains]=${filterData.full_name}&filters[mobile][$eq]=${filterData.mobile}&sort[0]=${currentColumn}:${!direction ? "asc" : "desc"
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
                        setMessage(err.response.data.message);
                        setMessageState("error");
                        setLoading(false);
                    }
                })
            : httpclient
                .get(
                    `admin-users?pagination=${+event
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
                        setMessage(err.response.data.message);
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
                    .put(`admin-users/${viewDetails.id}`, formData)
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
                            setMessage(err.response.data.message);
                            setMessageState("error");
                            setLoading(false);
                        }
                    })
            ) :
                httpclient
                    .post(`admin-users`, formData)
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
                            setMessage(err.response.data.message);
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
                .delete(`admin-users/${viewDetails.id}`, formData)
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
                        setMessage(err.response.data.message);
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
                        <h1>List Users</h1>
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
                            <Add style={{ marginRight: "5px" }} fontSize="small" /> Add User
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
                                        <InputLabel>Full Name</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            name="full_name"
                                            value={filterData.full_name}
                                            onChange={handleChangeFilter}
                                            onKeyDown={e => { if (e.key === "Enter") handleFilter() }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <InputLabel>Mobile</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            name="mobile"
                                            value={filterData.mobile}
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

                {
                    submittedData.full_name ||
                        submittedData.mobile ? (
                        <Grid item xs={12}>
                            <FilteredBox>
                                <span>Filtered: </span>

                                {submittedData.full_name && (
                                    <p>
                                        <span>Name: {submittedData.full_name}</span>
                                        <Close
                                            fontSize="small"
                                            onClick={() => handleRemove("full_name")}
                                        />
                                    </p>
                                )}
                                {submittedData.mobile && (
                                    <p>
                                        <span>Status: {submittedData.mobile}</span>
                                        <Close
                                            fontSize="small"
                                            onClick={() => handleRemove("mobile")}
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
                        name={"User"}
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



            {openDeleteDialog && <DeleteDialog name={"User"} viewDetails={viewDetails} sendDelete={sendDelete} />}

            {openEditDialog && (
                <EditDialogUser
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

export default Users;
