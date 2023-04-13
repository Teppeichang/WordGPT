import axios from "axios";
import { useState } from "react";
import { TextField } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    const URL = "https://api.openai.com/v1/chat/completions";
    try {
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
      setResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col mx-20 ">
      <p className="my-10 text-center text-3xl font-bold">WordGPT</p>
      <div className="flex flex-col bg-slate-200 rounded-lg p-10">
        <form className="flex flex-col justify-center my-5" onSubmit={sendMessage}>
          <TextField
            label="何か入力してください"
            variant="outlined"
            className="bg-white"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit" className="bg-blue-400 text-white py-2 mt-2 mb-10 rounded-lg w-80">
            文章作成
          </button>
        </form>
        <TextField label="回答" multiline rows={10} value={response} className="bg-white" />
      </div>
    </div>
  );
};

export default App;
