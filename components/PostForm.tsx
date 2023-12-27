"use client"
import React, { FormEvent } from 'react';
import { Switch } from '@tremor/react';
import toast from 'react-hot-toast';
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { getChatGPTResponse, templateWithId } from '@lib/actions';
import chalk from 'chalk';
import { useRouter } from 'next/navigation';
// appRouterの時はnavigationからインポートする。

// タイトルと内容を使って何かする関数を入れて使いまわせる
export default function PostPage(
  { formLabel, action, templateId }
  : 
  { formLabel: string, action: Function, templateId?: number }) {
  let router = useRouter();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const loadTemplate = async (templateId : any) => {
    if (templateId) {
      try {
        const template = await templateWithId(templateId);
        setTitle(template.title);
        setContent(template.content);
      } catch (error) {
        console.log(chalk.red("something went wrong at PostForm."));
        // エラー処理
      }
    }
  };

  React.useEffect(() => {
    loadTemplate(templateId); // テンプレートIDが変更された場合にのみ呼び出される
  }, [templateId]);

  // 次回
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChatGPTSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const titleForGPT = formData.get('title'); // 修正: 正しいキーで値を取得
      const response = await getChatGPTResponse(titleForGPT + "というタイトルの日報の" + formLabel + "の中身を100字程度で作成してください。");
      
      if (response) {
        setContent(response); // ChatGPTの応答を設定
        console.log(response)
      } else {
        setContent("NO RESPONSE");
        console.log("not response")
      }
    } catch (error) {
      toast.error("Chat GPTは応答していません。")
      console.error("ChatGPT error at PostForm");
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    console.log("Current Content:", content);
  }, [content]);

  // 実装中 switchがonの時にタイトルを元に日報を作る機能を付ける
  const handleSwitchChange = () => {
    setIsSwitchOn(!isSwitchOn);
    if (isSwitchOn){
    console.log("switch has been changed to true")
    } else if (!isSwitchOn){
    console.log("switch has been changed to false")
    }
  };
  const handleContentChange = (event : any) => {
    setContent(event.target.value);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result : boolean = await action(formData);
    if (!result){
      toast.error("You need to login!")
    } else {
      toast.success(formLabel + " has been done successfully!");
      router.push("/"); // ホームページにリダイレクト
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <div>
            <label htmlFor="toggelme" className="block text-xl font-large text-gray-700">{ formLabel }を作成</label>
          </div>
          <div className="block text-xs font-large text-gray-700">
          {
            isSwitchOn 
              ? `タイトルを元に、内容を自動で作成します。` 
              : <>
                  Try ChatGPT!
                </>
          }
          </div>
          <Switch color="fuchsia" onChange={ handleSwitchChange } checked={ isSwitchOn }/>
          <div className="flex justify-center w-full">
            <form className="space-y-4" onSubmit={ isSwitchOn ? handleChatGPTSubmit : handleSubmit} style={{ width: 'fit-content' }}>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
                <input type="text" name="title" className="mt-1 w-full border border-gray-300 p-2 rounded-md" required defaultValue={title}/>
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content:</label>
                <textarea name="content" className="mt-1 w-full border border-gray-300 p-2 rounded-md" rows={4} value={content} onChange={handleContentChange}></textarea>
              </div>
              <div>
                <div className="block text-sm font-small text-gray-400">*255文字まで入力できます*</div>
              </div>
              <div>
              {isSwitchOn ? (
                // isSwitchOn が true のときに表示するボタン
                <button disabled={isLoading} type="submit" className="ml-6 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md">
                  {isLoading ? "処理中..." :"Ask ChatGPT"}
                  <ChatBubbleOvalLeftEllipsisIcon className="ml-2 h-8 w-6 text-white" />
                </button>
              ) : (
                // isSwitchOn が false のときに表示するボタン
                <button type="submit" className="ml-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-7 rounded-md">
                  Create
                  <ChatBubbleOvalLeftEllipsisIcon className="ml-2 h-8 w-6 text-white" />
                </button>
              )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
