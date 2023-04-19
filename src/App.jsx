import axios from "axios";
import { useState } from "react";
import { TextField } from "@mui/material";

const App = () => {
  const OPENAI_API_REQUEST_URL = "https://api.openai.com/v1/chat/completions";
  const WP_REST_API_REQUEST_URL = "http://localhost:8080/wp-json/wp/v2/posts";

  const [mainKeyword, setMainKeyword] = useState("");
  const [subKeyword, setSubKeyword] = useState("");
  const [titleCandidate, setTitleCandidate] = useState("");

  const [title, setTitle] = useState("");
  const [headCandidate, setHeadCandidate] = useState("");

  const [head, setHead] = useState("");
  const [draftArticle, setDraftArticle] = useState("");

  const sendTitlePrompt = async (event) => {
    event.preventDefault();
    try {
      const titleCandidate = await axios.post(
        OPENAI_API_REQUEST_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `あなたはプロのブログ記事に特化したライターです。以下の制約条件と入力文をもとに、箇条書き形式でブログ記事タイトルを出力してください。/n
              #制約条件/n
              以下のキーワードを必ず使用すること/n
              ・${mainKeyword}/n
              ・${subKeyword}`,
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
      setTitleCandidate(titleCandidate.data.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  };

  const sendHeadPrompt = async (event) => {
    event.preventDefault();
    try {
      const headCandidate = await axios.post(
        OPENAI_API_REQUEST_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `あなたはプロのブログ記事に特化したライターです。以下のタイトルでブログ記事を作成するので、箇条書き形式で記事の見出しを出力してください。/n
              # 記事タイトル/n
              ・${title}`,
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
      setHeadCandidate(headCandidate.data.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  };

  const sendArticlePrompt = async (event) => {
    event.preventDefault();
    try {
      const draftArticle = await axios.post(
        OPENAI_API_REQUEST_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `あなたはプロのブログ記事に特化したライターです。以下の制約条件でブログ記事を作成してください。/n
              # 制約条件/n
              ・記事はタイトル・見出し・本文の構成にすること/.
              ・記事のタイトル${title}/n
              ・記事の見出し${headCandidate}
              `,
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
      setDraftArticle(draftArticle.data.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  };

  const createDraftArticle = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        WP_REST_API_REQUEST_URL,
        {
          title: title,
          content: draftArticle,
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
      <div className="flex justify-center items-center">
        <p className="my-10 text-center text-3xl font-bold">WordGPT</p>
        <p className="bg-green-400 text-green-800 font-semibold tracking-wider p-1 ml-1 rounded-lg">BETA</p>
      </div>
      <div className="flex flex-col bg-slate-100 rounded-lg p-10 mb-10">
        <form className="flex flex-col justify-center my-5" onSubmit={sendTitlePrompt}>
          <TextField
            label="メインキーワード"
            variant="outlined"
            className="bg-white"
            value={mainKeyword}
            onChange={(event) => setMainKeyword(event.target.value)}
          />
          <TextField
            label="サブキーワード"
            variant="outlined"
            className="bg-white"
            sx={{ mt: 2 }}
            value={subKeyword}
            onChange={(event) => setSubKeyword(event.target.value)}
          />
          <button type="submit" className="bg-blue-400 text-white py-2 mt-2 mb-5 rounded-lg w-80">
            タイトル作成
          </button>
        </form>
        <TextField
          label="タイトル候補"
          multiline
          rows={10}
          value={titleCandidate}
          className="bg-white"
          sx={{ mb: 10 }}
        />

        <form className="flex flex-col justify-center my-5" onSubmit={sendHeadPrompt}>
          <TextField
            label="タイトル"
            variant="outlined"
            className="bg-white"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button type="submit" className="bg-blue-400 text-white py-2 mt-2 mb-5 rounded-lg w-80">
            見出し作成
          </button>
        </form>
        <TextField
          label="見出し候補"
          multiline
          rows={10}
          value={headCandidate}
          className="bg-white"
          sx={{ mb: 10 }}
        />

        <form className="flex flex-col justify-center my-5" onSubmit={sendArticlePrompt}>
          <TextField
            label="タイトル"
            variant="outlined"
            className="bg-white"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            label="見出し"
            variant="outlined"
            className="bg-white"
            sx={{ mt: 2 }}
            value={head}
            onChange={(event) => setHead(event.target.value)}
          />
          <button type="submit" className="bg-blue-400 text-white py-2 mt-2 mb-5 rounded-lg w-80">
            記事作成
          </button>
        </form>
        <form className="flex flex-col justify-center" onSubmit={createDraftArticle}>
          <TextField label="記事" multiline rows={10} value={draftArticle} className="bg-white" />
          <button type="submit" className="bg-blue-400 text-white py-2 mt-2 mb-10 rounded-lg w-80">
            投稿
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
