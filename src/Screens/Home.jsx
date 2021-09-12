import { Typography } from "@material-ui/core";
import { Box } from "@material-ui/system";
import React from "react";

function Home() {
  return (
    <div>
      <Box
        sx={{
          pl: 1,
          borderLeft: "0.2rem solid #f57f17",
          borderBottom: "0.2rem solid #f57f17",
          width: "20rem",
          flexGrow: 1,
        }}
      >
        <Typography variant="h2">Главное меню</Typography>
      </Box>
    </div>
  );
}

export default Home;
