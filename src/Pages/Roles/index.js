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
import EditDialogRole from "../../Components/EditDialogRole";
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
  { id: "role_name", name: "Full Name" },

  { id: "status", name: "Status" },
  { id: "actions", name: "Actions" },
];

const adminColumns = [
  { id: "userID", name: "ID" },
  { id: "company_erply_id", name: "First Name" },
  { id: "role_name", name: "Last Name" },
  { id: "status", name: "User Name" },
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



const Roles = (props) => {

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

    role_name: "",
    status: "",
    remove: false,
  });

  const [submittedData, setSubmittedData] = useState({

    role_name: "",
    status: "",
    submit: false,
  });

  // useEffect(() => {
  //   getAllUsers();
  // }, []);

  useEffect(() => {
    if (

      filterData.role_name === "" &&
      filterData.status === ""
    ) {
      setSubmittedData({
        ...submittedData,
        submit: false,
      });
    }

    if (filterData.role_name === " ") filterData.role_name = "";
    if (filterData.status === " ") filterData.status = "";

    filterData.remove === true && handleFilter();
  }, [filterData]);

  useEffect(() => {
    let userStorage = JSON.parse(localStorage.getItem("role_filter"));
    userStorage !== null && setFilterData(userStorage);

    userStorage == null
      ? getAllUsers()
      :
      userStorage.role_name == "" &&
        userStorage.status == "" &&

        userStorage.removed == false
        ? getAllUsers()
        : console.log("users!");
  }, []);

  const getAllUsers = () => {
    setLoading(true);
    httpclient.get(`admin-roles?pagination=${rowsPerPage}`).then(({ data }) => {
      if (data.status === 200 || data.success) {
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

      role_name: filterData.role_name,
      status: filterData.status,

      submit: true,
    });
    filterData.remove = true;
    localStorage.setItem("role_filter", JSON.stringify(filterData));
    setLoading(true);
    if (

      filterData.role_name ||
      filterData.status
    ) {
      httpclient
        .get(
          `admin-roles?filters[name][$contains]=${filterData.role_name}&filters[status][$eq]=${filterData.status}&pagination=${rowsPerPage}&page=${1}`
        )
        .then(({ data }) => {
          if (data.status === 200 || data.success) {
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
          `admin-roles?filters[name][$contains]=${filterData.role_name}&filters[status][$eq]=${filterData.status}&sort[0]=${column === "role_name" ? "name" : column}:${!direction ? "asc" : "desc"
          }&pagination=${rowsPerPage}&page=${page}`
        )
        .then(({ data }) => {
          if (data.status === 200 || data.success) {
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
          `admin-roles?sort[0]=${column === "role_name" ? "name" : column}:${!direction ? "asc" : "desc"
          }&pagination=${rowsPerPage}`
        )
        .then(({ data }) => {
          if (data.status === 200 || data.success) {
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
          `admin-roles?filters[name][$contains]=${filterData.role_name}&filters[status][$eq]=${filterData.status}&sort[0]=${currentColumn === "role_name" ? "name" : currentColumn}:${!direction ? "asc" : "desc"
          }&pagination=${rowsPerPage}&page=${page}`
        )
        .then(({ data }) => {
          if (data.status === 200 || data.success) {
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
          `admin-roles?pagination=${rowsPerPage}&page=${page}`
        )
        .then(({ data }) => {
          if (data.status === 200 || data.success) {
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
          `admin-roles?filters[name][$contains]=${filterData.role_name}&filters[status][$eq]=${filterData.status}&sort[0]=${currentColumn === "role_name" ? "name" : currentColumn}:${!direction ? "asc" : "desc"
          }&pagination=${+event.target.value}&page=${page}`
        )
        .then(({ data }) => {
          setLoading(true);
          if (data.status === 200 || data.success) {
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
          `admin-roles?pagination=${+event
            .target.value}&page=${1}`
        )
        .then(({ data }) => {
          setLoading(true);
          if (data.status === 200 || data.success) {
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
          .put(`admin-roles/${viewDetails.id}`, formData)
          .then(({ data }) => {
            if (data.status === 200 || data.success) {
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
          .post(`admin-roles`, formData)
          .then(({ data }) => {
            if (data.status === 200 || data.success) {
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
        .delete(`admin-roles/${viewDetails.id}`, formData)
        .then(({ data }) => {
          if (data.status === 200 || data.success) {
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
            <h1>List Roles</h1>
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
              <Add style={{ marginRight: "5px" }} fontSize="small" /> Add Role
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
                    <InputLabel>Role Name</InputLabel>
                    <TextField
                      variant="outlined"
                      name="role_name"
                      value={filterData.role_name}
                      onChange={handleChangeFilter}
                      onKeyDown={e => { if (e.key === "Enter") handleFilter() }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InputLabel>Status</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        name="status"
                        value={filterData.status}
                        onChange={handleChangeFilter}
                        onKeyDown={e => { if (e.key === "Enter") handleFilter() }}
                      >
                        <MenuItem value={""}>Select</MenuItem>
                        <MenuItem value={"1"}>Active</MenuItem>
                        <MenuItem value={"0"}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
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
          submittedData.role_name ||
            submittedData.status ? (
            <Grid item xs={12}>
              <FilteredBox>
                <span>Filtered: </span>

                {submittedData.role_name && (
                  <p>
                    <span>Role Name: {submittedData.role_name}</span>
                    <Close
                      fontSize="small"
                      onClick={() => handleRemove("role_name")}
                    />
                  </p>
                )}
                {submittedData.status && (
                  <p>
                    <span>Status: {submittedData.status === "1" ? "Active" : "Inactive"}</span>
                    <Close
                      fontSize="small"
                      onClick={() => handleRemove("status")}
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
            name={"Role"}
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



      {openDeleteDialog && <DeleteDialog name={"Role"} viewDetails={viewDetails} sendDelete={sendDelete} />}

      {openEditDialog && (
        <EditDialogRole
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

export default Roles;
