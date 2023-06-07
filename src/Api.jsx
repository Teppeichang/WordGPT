import axios from "axios";
import nprogress from "nprogress";
import Swal from "sweetalert2";

const delay = (delayTime) => new Promise(resolve => setTimeout(resolve, delayTime));

export const sendTitlePrompt = async (mainKeyword, subKeyword, longTailKeyword) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    if (longTailKeyword === "" || longTailKeyword === null) {
      const draftTitle = await axios.post(
        process.env.REACT_APP_OPENAI_API_REQUEST_URL,
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `あなたはSEO・コンテンツマーケティングのスペシャリストです。これからブログ記事を作成します。以下の#制約条件 に従い、SEOに強いタイトルを10個出力してください。\n#制約条件\n32文字以内であること。\n以下のキーワードを必ず使用すること。\n・${mainKeyword}\n・${subKeyword}`,
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
      nprogress.done();
      return draftTitle.data.choices[0].message.content;
    }
    if (longTailKeyword) {
      const draftTitle = await axios.post(
        process.env.REACT_APP_OPENAI_API_REQUEST_URL,
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `あなたはSEO・コンテンツマーケティングのスペシャリストです。これからブログ記事を作成します。以下の#制約条件 に従い、SEOに強いタイトルを10個出力してください。\n#制約条件\n32文字以内であること。\n以下のキーワードを必ず使用すること。\n・${mainKeyword}\n・${subKeyword}\n・${longTailKeyword}`,
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
      nprogress.done();
      return draftTitle.data.choices[0].message.content;
    }
  } catch (error) {
    nprogress.done();
    Swal.fire({
      icon: "error",
      title: "エラーが発生しました。",
    });
  }
};

export const sendLeadPrompt = async (title) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    const draftHead = await axios.post(
      process.env.REACT_APP_OPENAI_API_REQUEST_URL,
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `あなたはSEO・コンテンツマーケティングのスペシャリストです。以下の#タイトル でブログ記事を作成するので、SEOに強い導入文を出力してください。\n# タイトル\n・${title}`,
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
    nprogress.done();
    return draftHead.data.choices[0].message.content;
  } catch (error) {
    nprogress.done();
    Swal.fire({
      icon: "error",
      title: "エラーが発生しました。",
    });
  }
};

export const sendHeadPrompt = async (title, lead) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    const draftHead = await axios.post(
      process.env.REACT_APP_OPENAI_API_REQUEST_URL,
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `あなたはSEO・コンテンツマーケティングのスペシャリストです。以下の#タイトル と#導入文 から始まるブログ記事を作成します。#タイトル と#導入文 の文脈に合う見出しを作成してください。\n# タイトル\n・${title}\n# 導入文\n・${lead}`,
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
    nprogress.done();
    return draftHead.data.choices[0].message.content;
  } catch (error) {
    nprogress.done();
    Swal.fire({
      icon: "error",
      title: "エラーが発生しました。",
    });
  }
};

export const sendArticlePrompt = async (headList) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  let draftArticleList = [];
  for (let i = 0; i < headList.length; i++) {
    console.log(`処理中...${i + 1}/${headList.length}`)
    try {
      nprogress.start();
      const draftArticle = await axios.post(
        process.env.REACT_APP_OPENAI_API_REQUEST_URL,
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `あなたはSEO・コンテンツマーケティングのスペシャリストです。以下の#キーワード についてSEOに強い記事を作成していただきます。記事作成の流れは以下の#記事作成の流れ に従っていただき、マークダウン形式で記事を出力してください。\n#キーワード\n${headList[i]}\n#記事作成の流れ\n1. #キーワード をタイトル(h2)とする。\n2. 1.で作成した導入文に中見出し(h3)と子見出し(h4)を作成する\n3. 2.で作成した各見出しに対して、1.と2.の文脈を踏まえた具体例付きの文章を作成する\n4. 3.で作成した文章に、可能であればURLや引用元を追記する`,
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
      draftArticleList.push(draftArticle.data.choices[0].message.content);
      Swal.fire({
        icon: "success",
        title: `${i + 1}個目の見出しの処理が完了しました。`,
        text: `処理状況: ${i + 1}/${headList.length}`,
        showConfirmButton: false,
        timer: 1500
      });
      await delay(1000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "エラーが発生しました。次の処理に移行します。",
        text: `処理状況: ${i + 1}/${headList.length}`,
        showConfirmButton: false,
        timer: 1500
      });
      await delay(1000);
    }
  }
  nprogress.done();
  return draftArticleList;
};

export const postArticle = async (title, lead, draftArticle) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    await axios.post(
      process.env.REACT_APP_WP_REST_API_REQUEST_URL,
      {
        title: title,
        content: `${lead}\n${draftArticle}`,
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
    nprogress.done();
    Swal.fire({
      icon: "success",
      title: "投稿に成功しました",
    });
  } catch (error) {
    nprogress.done();
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "投稿に失敗しました",
    });
  }
};
