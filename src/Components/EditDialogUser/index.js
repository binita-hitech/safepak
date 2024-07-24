import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    styled,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as React from 'react';


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

const EditDialogUser = (props) => {
    const [dialogDetails, setDialogDetails] = useState({
        open: true,
        success: false,
    });
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        full_name: '',
        role_id: '',
        email: '',
        address: '',
        mobile: '',
        status: '',
    });

    useEffect(() => {
        if (props.viewDetails) {
            setFormData({
                full_name: props.viewDetails.full_name || '',
                role_id: '',
                email: props.viewDetails.email || '',
                address: '',
                mobile: props.viewDetails.mobile || '',
                status: '',
            });
        }
    }, [props.viewDetails]);


    useEffect(() => {
        props.sendEdit(dialogDetails, formData);
    }, [dialogDetails]);


    const handleClose = () => {
        setDialogDetails({
            ...dialogDetails,
            open: false,
        });
    };

    const handleYes = () => {
        if (validate()) {
            setDialogDetails({
                ...dialogDetails,
                open: false,
                success: true,

            });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.full_name) newErrors.full_name = 'Name is required';
        if (!formData.role_id) newErrors.role_id = 'Role ID is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (formData.status === "") newErrors.status = 'Status is required';
        if (formData.mobile && formData.mobile.length > 10) newErrors.mobile = 'Phone number should be less than 10 digits';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
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
                    {props.viewDetails.id ? `Edit User` : `Add User`}
                </StyledHeaderTitle>
                <DialogContent>
                    <Box pt={3}>

                        <TextField
                            required
                            label="Role ID"
                            name="role_id"
                            type="number"
                            value={formData.role_id}
                            onChange={handleChange}
                            error={!!errors.role_id}
                            helperText={errors.role_id}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            required
                            label="Name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            error={!!errors.full_name}
                            helperText={errors.full_name}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            required
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            error={!!errors.mobile}
                            helperText={errors.mobile}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>

                            <Select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                error={!!errors.status}
                                helperText={errors.status}
                            >   
                                <MenuItem value={""}>Select</MenuItem>
                                <MenuItem value={1}>Active</MenuItem>
                                <MenuItem value={0}>Inactive</MenuItem>

                            </Select>
                        </FormControl>
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

export default EditDialogUser;
