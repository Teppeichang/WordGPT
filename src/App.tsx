import CopyButton from "./components/CopyButton";
import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { sendTitlePrompt, sendLeadPrompt, sendHeadPrompt, sendArticlePrompt, postArticle, } from "./Api";

const App = () => {
  const [mainKeyword, setMainKeyword] = useState<string>("");
  const [subKeyword, setSubKeyword] = useState<string>("");
  const [longTailKeyword, setLongTailKeyword] = useState<string>("");
  const [draftTitle, setDraftTitle] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [lead, setLead] = useState<string>("");
  const [head, setHead] = useState<string>("");
  const [draftArticle, setDraftArticle] = useState<string>("");

  const handleTitlePrompt = async (event: React.FormEvent) => {
    event.preventDefault();
    const draftTitle = await sendTitlePrompt(mainKeyword, subKeyword, longTailKeyword);
    setDraftTitle(draftTitle);
  };

  const handleLeadPrompt = async (event: React.FormEvent) => {
    event.preventDefault();
    const lead = await sendLeadPrompt(title);
    setLead(lead);
  };

  const handleHeadPrompt = async (event: React.FormEvent) => {
    event.preventDefault();
    const head = await sendHeadPrompt(title, lead);
    setHead(head);
  };

  const handleArticlePrompt = async (event: React.FormEvent) => {
    event.preventDefault();
    const draftArticle = await sendArticlePrompt(headList);
    setDraftArticle(draftArticle.join("\n"));
  };

  const headList = head.split("\n");

  const handlePostArticle = async (event: React.FormEvent) => {
    event.preventDefault();
    await postArticle(title, lead, draftArticle);
  };

  return (
    <div className="min-h-screen flex flex-col mx-20 ">
      <div className="flex justify-center items-center">
        <p className="my-10 text-center text-3xl font-bold">WordGPT</p>
        <p className="bg-green-400 text-green-800 font-semibold tracking-wider p-1 ml-1 rounded-lg">
          ver 2.0
        </p>
      </div>
      <div className="flex flex-col bg-slate-100 rounded-lg p-10 mb-10">
        <form className="flex flex-col justify-center my-5" onSubmit={handleTitlePrompt}>
          <p className="mb-1">記事のタイトルを生成</p>
          <TextField
            label="メインキーワード"
            variant="outlined"
            required
            className="bg-white"
            value={mainKeyword}
            onChange={(event) => setMainKeyword(event.target.value)}
          />
          <TextField
            label="サブキーワード"
            variant="outlined"
            required
            className="bg-white"
            sx={{ my: 2 }}
            value={subKeyword}
            onChange={(event) => setSubKeyword(event.target.value)}
          />
          <TextField
            label="ロングテール"
            variant="outlined"
            className="bg-white"
            sx={{ mb: 2 }}
            value={longTailKeyword}
            onChange={(event) => setLongTailKeyword(event.target.value)}
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
        <form className="flex flex-col justify-center my-5" onSubmit={handleLeadPrompt}>
          <p className="mb-1">記事のタイトルをもとにリード文を生成</p>
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
            リード文作成
          </Button>
        </form>
        <TextField
          label="リード文"
          multiline
          rows={10}
          value={lead}
          className="bg-white"
          sx={{ mb: 10 }}
        />
        <form className="flex flex-col justify-center my-5" onSubmit={handleHeadPrompt}>
          <p className="mb-1">記事のタイトル・リード文をもとに見出しを生成</p>
          <TextField
            label="タイトル"
            variant="outlined"
            className="bg-white"
            sx={{ mb: 2 }}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            label="リード文"
            multiline
            rows={10}
            value={lead}
            className="bg-white"
            sx={{ mb: 2 }}
            onChange={(event) => setLead(event.target.value)}
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
          label="見出し"
          multiline
          rows={10}
          value={head}
          className="bg-white"
          sx={{ mb: 10 }}
        />
        <form className="flex flex-col justify-center my-5" onSubmit={handleArticlePrompt}>
          <p className="mb-1">見出しをもとに記事本文を生成</p>
          <TextField
            label="見出し"
            multiline
            rows={10}
            value={head}
            className="bg-white"
            sx={{ mb: 2 }}
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
          <TextField
            label="記事本文"
            multiline
            rows={20}
            value={draftArticle}
            className="bg-white"
            sx={{ mt: 2 }}
            onChange={(event) => setDraftArticle(event.target.value)}
          />
        </form>
        <form className="flex flex-col justify-center my-5" onSubmit={handlePostArticle}>
          <p className="mb-1">プレビュー</p>
          <TextField
            label="タイトル"
            variant="outlined"
            className="bg-white"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            label="リード文"
            multiline
            rows={10}
            value={lead}
            className="bg-white"
            sx={{ my: 2 }}
            onChange={(event) => setLead(event.target.value)}
          />
          <TextField
            label="記事本文"
            multiline
            rows={20}
            value={draftArticle}
            className="bg-white"
            sx={{ mb: 2 }}
            onChange={(event) => setDraftArticle(event.target.value)}
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
            <CopyButton title={title} lead={lead} draftArticle={draftArticle} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
