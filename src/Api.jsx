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
              content: `あなたはプロのライターです。以下の制約条件をもとに、SEOに強いブログ記事タイトルを箇条書き形式で出力してください。\n#制約条件\n32文字以内であること。\n以下のキーワードを必ず使用すること。\n・${mainKeyword}\n・${subKeyword}`,
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
              content: `あなたはプロのライターです。以下の制約条件をもとに、SEOに強いブログ記事タイトルを箇条書き形式で出力してください。\n#制約条件\n32文字以内であること。\n以下のキーワードを必ず使用すること。\n・${mainKeyword}\n・${subKeyword}\n・${longTailKeyword}`,
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
            content: `あなたはプロのライターです。以下のタイトルでブログ記事を作成するので、SEOに強く、タイトルとの親和性が高い導入文を出力してください。\n# 記事タイトル\n・${title}`,
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
            content: `あなたはプロのライターです。以下のタイトルと導入文を使用したブログ記事を作成するので、タイトルとの親和性が高い見出しと、それぞれの見出しの下にに500文字程度の文章を加えた、SEOに強い文章を作成してください。\n# 記事タイトル\n・${title}\n# 導入文\n・${lead}`,
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
            content: `あなたはプロのライターです。以下の記事タイトル・導入文・見出しの構成で、マークダウン形式でブログ記事を作成してください。\n#記事のタイトル${title}\n#導入文\n${lead}#見出し${head}`,
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

export const createArticle = async (title, lead, draftArticle) => {
  nprogress.configure({ easing: "ease", speed: 500, minimum: 0.25 });
  try {
    nprogress.start();
    await axios.post(
      process.env.REACT_APP_WP_REST_API_REQUEST_URL,
      {
        title: title,
        content: `${lead}/n${draftArticle}`,
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
