import Swal from "sweetalert2";
import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { sendTitlePrompt, sendHeadPrompt, sendArticlePrompt, createArticle } from "./Api";

const App = () => {
  const [mainKeyword, setMainKeyword] = useState("");
  const [subKeyword, setSubKeyword] = useState("");
  const [draftTitle, setDraftTitle] = useState("");

  const [title, setTitle] = useState("");
  const [draftHead, setDraftHead] = useState("");

  const [head, setHead] = useState("");
  const [draftArticle, setDraftArticle] = useState("");

  const handleTitlePrompt = async (event) => {
    event.preventDefault();
    const draftTitle = await sendTitlePrompt(mainKeyword, subKeyword);
    setDraftTitle(draftTitle);
  };

  const handleHeadPrompt = async (event) => {
    event.preventDefault();
    const draftHead = await sendHeadPrompt(title);
    setDraftHead(draftHead);
  };

  const handleArticlePrompt = async (event) => {
    event.preventDefault();
    const draftArticle = await sendArticlePrompt(title, draftHead);
    setDraftArticle(draftArticle);
  };

  const handleCreateArticle = async (event) => {
    event.preventDefault();
    await createArticle(title, draftArticle);
  };

  const copyToClipboard = async (event) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(draftArticle);
      Swal.fire({
        icon: "success",
        title: "コピーしました",
      })
    } catch(error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "コピーに失敗しました",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col mx-20 ">
      <div className="flex justify-center items-center">
        <p className="my-10 text-center text-3xl font-bold">WordGPT</p>
        <p className="bg-green-400 text-green-800 font-semibold tracking-wider p-1 ml-1 rounded-lg">
          BETA
        </p>
      </div>
      <div className="flex flex-col bg-slate-100 rounded-lg p-10 mb-10">
        <form className="flex flex-col justify-center my-5" onSubmit={handleTitlePrompt}>
          <p className="mb-1">メインキーワードとサブキーワードをもとに記事のタイトルを生成</p>
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
            sx={{ my: 2 }}
            value={subKeyword}
            onChange={(event) => setSubKeyword(event.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disableElevation={true}
            className="text-white py-2 mb-5 rounded-lg max-w-xs"
            sx={{ backgroundColor: "#60A5FA", fontWeight: "bold" }}
          >
            タイトル作成
          </Button>
        </form>
        <TextField
          label="タイトル候補"
          multiline
          rows={10}
          value={draftTitle}
          className="bg-white"
          sx={{ mb: 10 }}
        />
        <form className="flex flex-col justify-center my-5" onSubmit={handleHeadPrompt}>
          <p className="mb-1">記事のタイトルをもとに見出しを生成</p>
          <TextField
            label="タイトル"
            variant="outlined"
            className="bg-white"
            sx={{ mb: 2 }}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disableElevation={true}
            className="text-white py-2 mb-5 rounded-lg max-w-xs"
            sx={{ backgroundColor: "#60A5FA", fontWeight: "bold" }}
          >
            見出し作成
          </Button>
        </form>
        <TextField
          label="見出し候補"
          multiline
          rows={10}
          value={draftHead}
          className="bg-white"
          sx={{ mb: 10 }}
        />

        <form className="flex flex-col justify-center my-5" onSubmit={handleArticlePrompt}>
          <p className="mb-1">記事のタイトル・見出しをもとに記事を生成</p>
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
            sx={{ my: 2 }}
            value={head}
            onChange={(event) => setHead(event.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disableElevation={true}
            className="text-white py-2 mb-5 rounded-lg max-w-xs"
            sx={{ backgroundColor: "#60A5FA", fontWeight: "bold" }}
          >
            記事作成
          </Button>
        </form>
        <form className="flex flex-col justify-center" onSubmit={handleCreateArticle}>
          <TextField
            label="記事"
            multiline
            rows={10}
            value={draftArticle}
            className="bg-white"
            sx={{ mb: 2 }}
          />
          <div className="flex">
            <Button
              type="submit"
              variant="contained"
              disableElevation={true}
              className="text-white py-2 mb-10 rounded-lg w-36"
              sx={{ backgroundColor: "#60A5FA", fontWeight: "bold" }}
            >
              投稿
            </Button>
            <Button
              onClick={copyToClipboard}
              variant="contained"
              disableElevation={true}
              className="text-white py-2 mb-10 rounded-lg w-36"
              sx={{ backgroundColor: "#60A5FA", fontWeight: "bold", ml: 3 }}
            >
              コピー
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
