import { TextField } from "@material-ui/core";
import { styled } from "@material-ui/system";

const SpecTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#263238",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#f57f17",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#263238",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f57f17",
    },
  },
});

export default SpecTextField;
