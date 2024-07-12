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

const DeleteDialog = (props) => {
    const [dialogDetails, setDialogDetails] = useState({
        open: true,
        success: false,
    });
   
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
        props.sendDelete(dialogDetails, formData);
    }, [dialogDetails]);


    const handleClose = () => {
        setDialogDetails({
            ...dialogDetails,
            open: false,
        });
    };

    const handleYes = () => {
       
            setDialogDetails({
                ...dialogDetails,
                open: false,
                success: true,

            });
        
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
                   Delete Company
                </StyledHeaderTitle>
                <DialogContent>
                    <Box pt={3}>
                        Are you sure you want to delete this company?
                    </Box>
                </DialogContent>
                <DialogActions styled={{ margin: "5px 10px" }}>
                    <Button onClick={handleClose} color="error" variant="contained" autoFocus>
                        No
                    </Button>
                    <Button
                        onClick={handleYes}
                        color="primary"
                        variant="contained"
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeleteDialog;
