import axios from "axios";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

const App = () => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  return (
    <div className="min-h-screen flex flex-col items-center">
      <TextField label="回答" multiline rows={4} />
      <form className="flex flex-row items-center">
        <TextField label="何か入力してください" variant="outlined" />
        <Button variant="contained">Submit</Button>
      </form>
    </div>
  );
};

export default App;
