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

const EditDialogConsumer = (props) => {
    const [dialogDetails, setDialogDetails] = useState({
        open: true,
        success: false,
    });
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        company_id: '',
        
    });

    // useEffect(() => {
    //     if (props.viewDetails) {
    //         setFormData({
    //             company_name: props.viewDetails.company_name || '',
    //             company_id: props.viewDetails.company_id || '',
    //             company_email: props.viewDetails.company_email || '',
    //             company_address: props.viewDetails.company_address || '',
    //             company_phone: props.viewDetails.company_phone || '',
    //         });
    //     }
    // }, [props.viewDetails]);


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
        if (!formData.name) newErrors.company_name = 'Consumer Name is required';
        if (!formData.company_id) newErrors.company_erply_id = 'Company ID is required';
   
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
                    {props.viewDetails.id ? `Edit Consumer` : `Add Consumer`}
                </StyledHeaderTitle>
                <DialogContent>
                    <Box pt={3}>

                    <TextField
                            required
                            label="Company ID"
                            name="company_id"
                            type="number"
                            value={formData.company_id}
                            onChange={handleChange}
                            error={!!errors.company_id}
                            helperText={errors.company_id}
                            fullWidth
                            margin="normal"
                        />
                        
                        <TextField
                            required
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
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

export default EditDialogConsumer;
