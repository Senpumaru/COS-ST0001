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

export const FormSlideChoice = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
    <Box  >
      <TabList onChange={handleChange} aria-label="lab API tabs example">
        <Tab label="Группа МП" value="1" />
        <Tab label="МП" value="2" />
      </TabList>
    </Box>
    <TabPanel sx={{p: 0}} value="1"><FormSlideGroup/></TabPanel>
    <TabPanel sx={{p: 0}} value="2"><FormSlides/></TabPanel>
    
  </TabContext>
  );
};

export default FormSlideChoice;