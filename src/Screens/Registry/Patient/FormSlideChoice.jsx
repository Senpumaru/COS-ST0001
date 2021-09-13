import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FormBlocks from './Block/FormBlocks';
import FormBlockGroup from './Block/FormBlockGroup';
import FormSlideGroup from './Slide/FormSlideGroup';
import FormSlides from './Slide/FormSlides';
import { useFormContext } from 'react-hook-form';

export const FormSlideChoice = () => {
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
    <Box  >
      <TabList onChange={handleChange} aria-label="lab API tabs example">
      {getValues("slideCodes").length >= 1 ? null : <Tab label="Группа МП" value="1" />}
          {getValues("slideGroupCode") ? null : <Tab label="МП" value="2" />}
      </TabList>
    </Box>
    <TabPanel sx={{p: 0}} value="1"><FormSlideGroup/></TabPanel>
    <TabPanel sx={{p: 0}} value="2"><FormSlides/></TabPanel>
    
  </TabContext>
  );
};

export default FormSlideChoice;