import { Close, Error, Remove } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    styled,
    TextField,
    Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as React from 'react';

const FlexContent = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    fontSize: "17px",
    marginBottom: "10px",
    alignItems: "flex-start",
}));

const FlexInnerTitle = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "280px",
    maxWidth: "250px",
    fontWeight: "600",
}));

const Values = styled("div")(({ theme }) => ({
    marginLeft: "15px",
    fontWeight: "500",
    color: theme.palette.primary.dark,
}));


const StyledHeaderTitle = styled(DialogTitle)(({ theme }) => ({
    background: theme.palette.primary.main,
    color: "#fff",
    position: "relative",
    "& button": {
        position: "absolute",
        right: "15px",
        top: "15px",
        color: "#fff",
    },
}));

const EditDialogRole = (props) => {
    const [dialogDetails, setDialogDetails] = useState({
        open: true,
        success: false,
    });
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        company_id: "",
        name: '',
        permissions: [
            { id: "", name: '', status: 0 },
            { id: "", name: '', status: 0 },
        ],
    });

    useEffect(() => {
        if (props.viewDetails) {
            setFormData({

                name: props.viewDetails.role_name || '',
                permissions: props.viewDetails.permissions || [
                    { id: 1, status: 0 },
                    { id: 2, status: 0 },
                ],
            });
        }
    }, [props.viewDetails]);

    useEffect(() => {
        props.sendEdit(dialogDetails, formData);
    }, [dialogDetails, formData]);

    const handleClose = () => {
        setDialogDetails({
            ...dialogDetails,
            open: false,
        });
    };

    const handleYes = () => {
        setFormData((prevData) => ({
            ...prevData,
            permissions: prevData.permissions.map(permission => {
                return { id: permission.id, status: permission.status };
            }
            ),
        }));
        setDialogDetails({
            ...dialogDetails,
            open: false,
            success: true,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePermissionChange = (id, status) => {
        setFormData((prevData) => ({
            ...prevData,
            permissions: prevData.permissions.map(permission =>
                permission.id === id ? { ...permission, status } : permission
            ),
        }));
    };

    const addPermission = () => {
        setFormData((prevData) => ({
            ...prevData,
            permissions: [
                ...prevData.permissions,
                { id: prevData.permissions.length + 1, status: 0 }
            ],
        }));
    };

    const removePermission = (id) => {
        setFormData((prevData) => ({
            ...prevData,
            permissions: prevData.permissions.filter(permission => permission.id !== id),
        }));
    };

    return (
        <div>
            <Dialog
                open={dialogDetails.open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <StyledHeaderTitle id="alert-dialog-title">
                    {props.viewDetails.id ? `Edit Role` : `Add Role`}
                </StyledHeaderTitle>
                <DialogContent>
                    <Box pt={3}>
                        <Grid container spacing={2}>
                            {/* Left Side */}
                            <Grid item xs={12} md={12}>
                                {props.viewDetails.id ? null :
                                    <FlexContent>
                                        <FlexInnerTitle>
                                            <span>Company ID</span> <span> : </span>
                                        </FlexInnerTitle>
                                        <Values><TextField
                                            required
                                            label="Company ID"
                                            name="company_id"
                                            type="number"
                                            value={formData.company_id}
                                            onChange={handleChange}
                                            sx={{ marginBottom: '10px', width: "200px" }}

                                        /></Values>
                                    </FlexContent>
                                }

                                <FlexContent>
                                    <FlexInnerTitle>
                                        <span>Role Name</span> <span> : </span>
                                    </FlexInnerTitle>
                                    <Values><TextField
                                        required
                                        label="Role Name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        sx={{ marginBottom: '10px', width: "200px" }}


                                    /></Values>
                                </FlexContent>

                                {formData.permissions.map((permission, index) => (
                                    <div key={index} style={{ marginBottom: '10px' }}>
                                        <label>
                                            <FlexContent>
                                                {props.viewDetails.id ? (
                                                    <FlexInnerTitle>
                                                        <span>Permission - {permission.name}</span> <span> : </span>
                                                    </FlexInnerTitle>
                                                ) : (

                                                    <FlexInnerTitle>
                                                        <span><TextField
                                                            required
                                                            label="Permission"
                                                            type="number"
                                                            name="id"
                                                            value={permission.id}
                                                            onChange={(e) =>
                                                                handlePermissionChange(permission.id, parseInt(e.target.value))
                                                            }
                                                            sx={{ marginBottom: '10px', width: "200px" }}


                                                        /></span> <span> : </span>
                                                    </FlexInnerTitle>
                                                )}

                                                <Values>
                                                    <Select
                                                        sx={{ width: "200px" }}
                                                        value={permission.status}
                                                        onChange={(e) =>
                                                            handlePermissionChange(permission.id, parseInt(e.target.value))
                                                        }
                                                    >
                                                        <MenuItem value={0}>Inactive</MenuItem>
                                                        <MenuItem value={1}>Active</MenuItem>
                                                    </Select>
                                                    {""}{<Tooltip title="Remove Permissions"><IconButton sx={{ cursor: "pointer", marginLeft: "20px" }} onClick={() => removePermission(permission.id)}><Close /></IconButton></Tooltip>}
                                                </Values>
                                            </FlexContent>
                                        </label>

                                    </div>
                                ))}
                                {
                                    <Button onClick={addPermission} variant="contained" color="primary">
                                        Add Permission
                                    </Button>}
                            </Grid>
                        </Grid>

                    </Box>
                </DialogContent>
                <DialogActions styled={{ margin: "5px 10px" }}>
                    <Button onClick={handleClose} color="error" variant="contained" autoFocus>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleYes}
                        color="primary"
                        variant="contained"
                        autoFocus
                    >
                        {props.viewDetails.id ? `Edit` : `Save`}
                    </Button>

                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditDialogRole;