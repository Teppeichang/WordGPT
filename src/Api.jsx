import axios from "axios";
import nprogress from "nprogress";
import Swal from "sweetalert2";

export const sendTitlePrompt = async (mainKeyword, subKeyword) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    const draftTitle = await axios.post(
      process.env.REACT_APP_OPENAI_API_REQUEST_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `あなたはプロのライターです。以下の制約条件をもとに、SEOに強いブログ記事タイトルを箇条書き形式で出力してください。/n
            #制約条件/n
            32文字以内であること。/n
            以下のキーワードを必ず使用すること。/n
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
    nprogress.done();
    return draftTitle.data.choices[0].message.content;
  } catch (error) {
    nprogress.done();
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "エラーが発生しました。",
    });
  }
};

export const sendHeadPrompt = async (title) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    const draftHead = await axios.post(
      process.env.REACT_APP_OPENAI_API_REQUEST_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `あなたはプロのライターです。以下のタイトルでブログ記事を作成するので、SEOに強く、タイトルとの親和性が高い見出しを、箇条書き形式で出力してください。/n
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
    nprogress.done();
    return draftHead.data.choices[0].message.content;
  } catch (error) {
    nprogress.done();
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "エラーが発生しました。",
    });
  }
};

export const sendArticlePrompt = async (title, draftHead) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    const draftArticle = await axios.post(
      process.env.REACT_APP_OPENAI_API_REQUEST_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `あなたはプロのライターです。以下の制約条件に従い、SEOに強い記事を作成してください。/n
            # 制約条件/n
            ・記事はタイトル・見出し・本文の構成にすること/n
            ・マークダウン形式で文章を出力すること/n
            ・記事のタイトル${title}/n
            ・記事の見出し${draftHead}
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
    nprogress.done();
    return draftArticle.data.choices[0].message.content;
  } catch (error) {
    nprogress.done();
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "エラーが発生しました。",
    });
  }
};

export const createArticle = async (title, draftArticle) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    await axios.post(
      process.env.REACT_APP_WP_REST_API_REQUEST_URL,
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