import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import FormBlocks from "./Block/FormBlocks";
import FormBlockGroup from "./Block/FormBlockGroup";
import { useFormContext } from "react-hook-form";
import { Alert } from "@mui/material";

export const FormBlockChoice = () => {
  /*** React Hook Form ***/
  const {
    control,
    watch,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useFormContext();

  

  const [tab, setTab] = React.useState("1");

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <TabContext value={tab}>
      <Box>
        <Alert severity="info">
          Оформление "ГРУППА" отключает функциональность оформления блоков без группы. Для оформления блоков без
          присвоенной группы, выберите вкладку "БЛОК".
        </Alert>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          {getValues("blockCodes").length >= 1 ? null : <Tab label="Группа Блоков" value="1" />}
          {getValues("blockGroupCode") ? null : <Tab label="Блоки" value="2" />}
        </TabList>
      </Box>
      <TabPanel sx={{ p: 0 }} value="1">
        <FormBlockGroup />
      </TabPanel>
      <TabPanel sx={{ p: 0 }} value="2">
        <FormBlocks />
      </TabPanel>
    </TabContext>
  );
};

export default FormBlockChoice;
