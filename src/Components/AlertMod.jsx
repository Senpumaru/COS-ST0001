import { Alert, Fade, IconButton, Snackbar } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { resetPatients } from "../Store/Slices/patientSlice";
import CloseIcon from "@material-ui/icons/Close";

function AlertMod(props) {
  const { text, open: openAlert, state: setOpenAlert, severity, color } = props;
  const dispatch = useDispatch();
  return (
    <Fade in={openAlert}>
      <Snackbar anchorOrigin={{vertical:"bottom", horizontal:"center"}} open={openAlert}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch(resetPatients());
                setOpenAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          severity={severity}
          color={color}
        >
          {text}
        </Alert>
      </Snackbar>
    </Fade>
  );
}

export default AlertMod;
