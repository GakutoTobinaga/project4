"use server"
import { getServerSession } from 'next-auth';
import { authOptions } from 'auth/auth-config';
// prisma
import prisma from "@lib/prisma";
import { Session } from 'next-auth';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ReportWithAuthor, TemplatesWithAuthor } from './types';
import { CommentFormProps } from 'interface_type/interface_type';
import { IncomingWebhook } from "@slack/webhook";
import { OpenAI } from "openai";
import chalk from 'chalk';

// sessionからusernameを取得する関数.
export const fetchUsername = async () : Promise< string | undefined | null>=> {
  const session: Session | null | undefined = await getServerSession(authOptions);
  // セッションが存在しない場合はundefinedを返す
  if (!session || !session.neouser) {
    console.log("No session found!");
    return null;
  }
  // セッションからユーザー名を取得して返す
  const username = session.neouser.username;
  console.log("Fetched username: ", username);
  return username;
};

// sessionからusernameを取得する関数2. もう少し学べば改良ができそうなため作成
export const fetchUsernameX = async () : Promise<string>=> {
  // https://next-auth.js.org/configuration/nextjs
  const session: Session | null | undefined = await getServerSession(authOptions);

  return session?.user?.name ?? "Unknown" as string;
}

// sessionからusernameを取得し、それを使ってユーザーIDを取得する関数.
export const fetchIdWithUsername = async () => {
  const session: Session | null = await getServerSession(authOptions);
  let neouser = {
    username: "User",
  }
  if (session === null || session === undefined) {
    return undefined
  } else {
    neouser.username = session.neouser?.username
  }
  // prismaのUserテーブルからneouserの値で検索
  const userId = await prisma.user.findUnique({
    where: { username: neouser.username},
    select: {
      id: true,
    }
  });
  // もしauthorIdがnullならユーザー未登録者のID(未登録者ID:1)
  if (userId === null) {
    console.log("userID is ...")
    return undefined;
  } else {
    console.log(userId.id)
    return userId.id;
  }
};

// 日報更新
export const updateReport = async (id: number, data: FormData) => {
  const content = data.get('content') as string;
  try {
    // データベースの更新処理
    await prisma.report.update({
      where: {
        id: id,
      },
      data: {
        content,
      },
    });
    //redirect('/')
    return { success: true };
  } catch (error) {
    console.error("データベース更新エラー：", error);
    return { success: false };
    // エラーが発生した場合の処理
    //redirect('/')
  }
};

// 日報削除 // あとで認証がいるタイプに変更、現状誰でもどれでも消せる 済
export const deleteRepo = async (id: number) => {
  await prisma.report.delete({
    where: {
      id,
    },
  });
  redirect('/');
};

// slackにメッセージを飛ばすserver actions
export const sendSlackMessage = async ( message : string, username : string ) => {
  // 入力値の検証
  const url = process.env.SLACK_WEBHOOK_URL as string;
  const webhook = new IncomingWebhook(url);
  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "新規投稿がありました。",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `:book:*投稿タイトル:*\n${message} \n:pencil2:投稿者:*${username}`,
          },
        ],
      },
    ],
  };
  await webhook.send(payload);
  console.log(chalk.green("success: sendSlackMessage"))
}

// 日報追加 slackの通知つき
export const addReport = async (data: FormData) : Promise< { success : boolean } >=> {
  const userId = await fetchIdWithUsername();
  const userName = await fetchUsername(); // slack用に追加
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  if (userName && userId) {
    // await sendSlackMessage(title, userName); メンテナンス, コメントアウト.
    await prisma.report.create({
      data: {
        title,
        content,
        authorId: userId, // 見つからない場合は未登録ユーザーで登録. (未登録ユーザーID:1) => ”登録しない”に変更
        isPosted: true,
      }
    });
    console.log(chalk.green("success: addReport"))
    return { success : true }
  } else {
    console.error(chalk.red("failed: addReport"))
    return { success : false }
  }
};

// データベースに新しい日報下書きを追加
export const addDraft = async (data: FormData) : Promise< { success : boolean } >=> {
  const userId = await fetchIdWithUsername();
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  if (userId){
    await prisma.report.create({
      data: {
        title,
        content,
        authorId: userId,
        isPosted: false,
      }
    });
    console.log(chalk.green("success: addDraft"))
    return { success : true }
  } else {
    console.error(chalk.red("failed: addDraft"))
    return { success : false }
  }
    // return report;したいなら、非同期関数ではPromise<void>を指定する。
    // successオブジェクトを返すことによってtoastとかにも使える。
};

// 日報テンプレート追加
export const addTemplate = async (data: FormData) : Promise< { success : boolean } >=> {
  const userId = await fetchIdWithUsername();
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  // sessionからneouserを取得
  // 型定義を見直す
  if (userId) {
  await prisma.templates.create({
    data: {
      title,
      content,
      authorId: userId,
    }
  });
    console.log(chalk.green("success: addTemplates"))
    return { success : true }
  } else {
    console.error(chalk.red("failed: addTemplates"))
    return { success : false }
  }
};

// 日報に対するコメントを追加
export const addComment = async (data: FormData, props : CommentFormProps) => {
  const content = data.get('content') as string;
  // session中のユーザーネームを取得
  const userId = await fetchIdWithUsername();
  const newReportId = props.reportId; // ここでreportIdを抽出
  // コメントを追加

  // なぜundefinedになるか原因を探る
  // reportIdが存在することを確認
  if (newReportId === undefined) {
    throw new Error('reportId is undefined');
  }
  if (userId) 
  await prisma.comment.create({
    data: {
      content,
      authorId: userId,
      reportId: newReportId,
    }
  });
  revalidatePath('/');
};

// FormData = TypeScriptは用意されている, 後からget等の処理が必要
export const updateReportX = async (authorId: number, formData: FormData) : Promise<{success : boolean;}> => {
  //　引数に入れたFormDataからgetで情報を引き出す
    const title = formData.get('fixedTitleByUser') as string;
    const content = formData.get('fixedContentByUser') as string;
    const status = formData.get('fixedIsPostedByUser') || '下書き';
    const newIsPosted : boolean = status === '投稿済';
    try {
  // 引き出した情報で検索, 更新
    await prisma.report.update({
      where: {
       id: authorId,
      },
      data: {
        title,
        content,
        isPosted: newIsPosted,
      },
  });
    return { success : true }
  } catch (error) {
    console.error("error")
    return { success : false }
  }
}

// 全ての日報を取得する (timeline用)
export const allReports = async(): Promise<ReportWithAuthor[]>=> {
  const Allreports = await prisma.report.findMany({
    where: {
      isPosted: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          username: true,
        }
      }
    },
  });
  return Allreports
}

// 全ての日報をsession userに基づいて取得する (mypage用)
export const allReportsWithUserId = async(): Promise<ReportWithAuthor[] | undefined>=> {
  const userId = await fetchIdWithUsername();
  if (userId){
  const allReportsWithUserId = await prisma.report.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          username: true,
        }
      }
    },
  });
  return allReportsWithUserId;
} else {
 return undefined
}
}

// 全てのテンプレートをsession userに基づいて取得する
export const allTemplatesWithUserId = async(): Promise<any>=> {
  const userId = await fetchIdWithUsername();
  if (userId){
  const allTemplatesWithUserId = await prisma.templates.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          username: true,
        }
      }
    },
  });
  return allTemplatesWithUserId;
}
}

// テンプレートを引数の数字に基づいて取得する
export const templateWithId = async( templateId : any ): Promise<any>=> {
  if (templateId){
  const templateWithId = await prisma.templates.findUnique({
    where: {
      id: templateId,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          username: true,
        }
      }
    },
  });
  return templateWithId
}
}

// 日報IDを元に日報を取得する(usernameのみ追加で含まれる) ない場合はnullを返す
export const fetchReportWithReportId = async(id: any): Promise<any> => {
  const report = await prisma.report.findUnique({
    where: {
      id: id,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          username: true,
        }
      }
    },
  });
  return report;
}

// もしパラメータがあったら検索して表示、パラメータがなければ全部
export const getReports = async (searchParam?: string): Promise<ReportWithAuthor[]> => {
  let searchCondition = {};
  if (searchParam) {
    searchCondition = {
      OR: [
        {
          title: {
            contains: searchParam,
            mode: 'insensitive', // 大文字小文字を区別しない
          },
        },
        {
          content: {
            contains: searchParam,
            mode: 'insensitive', // 大文字小文字を区別しない
          },
        },
      ],
    };
  }

  const reports = await prisma.report.findMany({
    where: {
      isPosted: true,
      ...searchCondition,
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          username: true,
        }
      }
    },
  });

  return reports;
};

// chatGPTにプロンプトを送信して 答えの文章を返す関数, (usersMessageに入れた言葉に対してchatGPTが答えをreturn)
export const getChatGPTResponse = async (usersMessage: string) => {
  // OpenAI APIの設定
  const prompt: string = usersMessage;
  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });
  // ChatGPTにプロンプトを送信し、レスポンスを取得
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });
    return chatCompletion.choices[0].message.content;
    // 生成されたテキストを変数に格納して返す
  } catch (error) {
    console.error(chalk.red("failed: getChatGPTResponse"))
    throw error;
  }
};

// datepickerの練習関数
export const datePickerTest = (value: any) => {
  console.log(value)
}