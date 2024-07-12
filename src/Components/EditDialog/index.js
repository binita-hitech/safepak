import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
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

const EditDialog = (props) => {
    const [dialogDetails, setDialogDetails] = useState({
        open: true,
        success: false,
    });
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        company_name: '',
        company_erply_id: '',
        company_email: '',
        company_address: '',
        company_phone: '',
    });

    useEffect(() => {
        if (props.viewDetails) {
            setFormData({
                company_name: props.viewDetails.company_name || '',
                company_erply_id: props.viewDetails.company_erply_id || '',
                company_email: props.viewDetails.company_email || '',
                company_address: props.viewDetails.company_address || '',
                company_phone: props.viewDetails.company_phone || '',
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
        if (!formData.company_name) newErrors.company_name = 'Company Name is required';
        if (!formData.company_erply_id) newErrors.company_erply_id = 'Company ERPLY ID is required';
        if (!formData.company_email) newErrors.company_email = 'Company Email is required';
        if (formData.company_phone && formData.company_phone.length > 10) newErrors.company_phone = 'Phone number should be less than 10 digits';
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
                    {props.viewDetails.id ? `Edit Company` : `Add company`}
                </StyledHeaderTitle>
                <DialogContent>
                    <Box pt={3}>
                        <TextField
                            required
                            label="Company Name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            error={!!errors.company_name}
                            helperText={errors.company_name}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            required
                            label="Company ERPLY ID"
                            name="company_erply_id"
                            type="number"
                            value={formData.company_erply_id}
                            onChange={handleChange}
                            error={!!errors.company_erply_id}
                            helperText={errors.company_erply_id}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            required
                            label="Company Email"
                            name="company_email"
                            type="email"
                            value={formData.company_email}
                            onChange={handleChange}
                            error={!!errors.company_email}
                            helperText={errors.company_email}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Company Address"
                            name="company_address"
                            value={formData.company_address}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Company Phone"
                            name="company_phone"
                            value={formData.company_phone}
                            onChange={handleChange}
                            error={!!errors.company_phone}
                            helperText={errors.company_phone}
                            fullWidth
                            margin="normal"
                        />
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

export default EditDialog;
