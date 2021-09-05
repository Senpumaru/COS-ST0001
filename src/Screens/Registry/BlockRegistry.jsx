import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createBlocks } from "../../Store/Slices/blockSlice";
import BlockForm from "./Block/BlockForm";
import FormStep2 from "./Patient/FormStep2";

/*** Material-UI Styles ***/
const useStyles = makeStyles((theme) => ({}));

function BlockRegistry() {
  /*** Material-UI Styles ***/
  const classes = useStyles();

  return (
    <Box sx={{ flexGrow: 1, p: 1 }}>
      <Typography>Добавление блоков к существующему пациенту</Typography>
      
      <BlockForm />
    </Box>
  );
}

export default BlockRegistry;
