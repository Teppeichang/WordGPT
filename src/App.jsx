import axios from "axios";
import { useState } from "react";
import { TextField, Button } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async(event) => {
    event.preventDefault();
    const URL = "https://api.openai.com/v1/chat/completions";
    try{
      const response = await axios.post(
        URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      console.log(response)
      setResponse(response);
    } catch(error) {
      console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <p className="mt-10">WordGPT</p>
      <form className="flex flex-col items-center my-5" onSubmit={sendMessage}>
        <TextField
          label="何か入力してください"
          variant="outlined"
          className="w-80"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button variant="contained" sx={{ my: 2 }} type="submit">
          文章作成
        </Button>
      </form>
      <TextField label="回答" multiline rows={4} className="w-80" value={response} />
    </div>
  );
};

export default App;
