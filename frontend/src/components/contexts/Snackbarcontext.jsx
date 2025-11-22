import React, { createContext, useState } from "react";
import { Snackbar } from "@material-ui/core";
import MySnackbarContentWrapper from "../mySnackBarWrapper/MySnackbarWrapper";

export const SnackBarcontext = createContext();

const SnackBarProvider = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [snackbarvariant, setSnackbarvariant] = useState('success'); // 'error', 'info', 'success', 'warning'

    const controlSnackBar = (msg, variant) => {
        setSnackbarMsg(msg);
        setSnackbarOpen(true);
        setSnackbarvariant(variant);
    }

    return (
        <SnackBarcontext.Provider value={{ controlSnackBar }}>
            {children}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <MySnackbarContentWrapper
                    onClose={() => setSnackbarOpen(false)}
                    variant={snackbarvariant}
                    message={snackbarMsg}
                />
            </Snackbar>
        </SnackBarcontext.Provider>
    )
}

export default SnackBarProvider;