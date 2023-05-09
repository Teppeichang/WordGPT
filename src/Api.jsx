import axios from "axios";
import nprogress from "nprogress";
import Swal from "sweetalert2";

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
    }
    if (longTailKeyword) {
      const draftTitle = await axios.post(
        process.env.REACT_APP_OPENAI_API_REQUEST_URL,
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `あなたはプロのライターです。以下の制約条件をもとに、SEOに強いブログ記事タイトルを箇条書き形式で出力してください。/n
              #制約条件/n
              32文字以内であること。/n
              以下のキーワードを必ず使用すること。/n
              ・${mainKeyword}/n
              ・${subKeyword}/n
              ・${longTailKeyword}`,
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
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "エラーが発生しました。",
    });
  }
};

export const sendLeadPrompt = async(title) => {
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
            content: `あなたはプロのライターです。以下のタイトルでブログ記事を作成するので、SEOに強く、タイトルとの親和性が高い導入文を出力してください。/n
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
}

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
            content: `あなたはプロのライターです。以下のタイトルと導入文を使用したブログ記事を作成するので、SEOに強く、タイトルとの親和性が高い見出しを、箇条書き形式で出力してください。/n
            # 記事タイトル/n
            ・${title}/n
            # 導入文/n
            ・${lead}/n`,
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

export const sendArticlePrompt = async (title, lead, head) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    const draftArticle = await axios.post(
      process.env.REACT_APP_OPENAI_API_REQUEST_URL,
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `あなたはプロのライターです。以下の制約条件に従い、SEOに強い記事を作成してください。/n
            # 制約条件/n
            ・記事はタイトル・導入文・見出し・本文の構成にすること/n
            ・マークダウン形式で文章を出力すること/n
            ・記事のタイトルは${title}にすること/n
            ・記事の導入文は${lead}にすること/n
            ・記事の見出しは${head}にすること
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
