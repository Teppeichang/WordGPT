import axios from "axios";
import { useState } from "react";
import { TextField } from "@mui/material";

const App = () => {
  const OPENAI_API_REQUEST_URL = "https://api.openai.com/v1/chat/completions";
  const WP_REST_API_REQUEST_URL = "http://localhost:8080/wp-json/wp/v2/posts";

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const sendPrompt = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        OPENAI_API_REQUEST_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
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

  const postArticle = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        WP_REST_API_REQUEST_URL,
        {
          title: "WP REST APIからの投稿テストです",
          content: response,
          status: "draft",
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Basic ${process.env.REACT_APP_WP_API_AUTHORIZATION}`,
          },
        }
      );
      console.log("投稿に成功しました");
    } catch (error) {
      console.log(error.response);
      console.log("投稿に失敗しました");
    }
  };

  return (
    <div className="min-h-screen flex flex-col mx-20 ">
      <p className="my-10 text-center text-3xl font-bold">WordGPT</p>
      <div className="flex flex-col bg-slate-100 rounded-lg p-10">
        <form className="flex flex-col justify-center my-5" onSubmit={sendPrompt}>
          <TextField
            label="何か入力してください"
            variant="outlined"
            className="bg-white"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <button type="submit" className="bg-blue-400 text-white py-2 mt-2 mb-10 rounded-lg w-80">
            文章作成
          </button>
        </form>
        <form className="flex flex-col justify-center" onSubmit={postArticle}>
          <TextField label="回答" multiline rows={10} value={response} className="bg-white" />
          <button type="submit" className="bg-blue-400 text-white py-2 mt-2 mb-10 rounded-lg w-80">
            WP投稿
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
