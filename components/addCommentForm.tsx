"use client"
import { Button } from '@tremor/react';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { addComment, fetchReportWithReportId } from '@lib/actions';
// reportIdの型をインポート
import { CommentFormProps } from 'interface_type/interface_type';
import { useState } from 'react';
import { getChatGPTResponse } from '@lib/actions';
import { useRouter } from 'next/navigation';

export interface CommentFormProps2 {
  reportId: number
};

export default async function CommentForm({ reportId }: CommentFormProps) {
  const router = useRouter()
  const [chat, setChat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // chatgptに送信できているか試す。後に移動させる

  const handleChatGPTSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const content = formData.get('contentGPT');
      const report = await fetchReportWithReportId(reportId)
      const response = await getChatGPTResponse("日報は" + report.content + "日報に対して、以下の複数単語を使ってコメントを作成して コメントのみ出力して 50文字程度" + content);
      setChat(response ? response : "NO RESPONSE"); // ChatGPTの応答をテキストボックスに設定
      return chat
    } catch (error) {
      setChat("NO RESPONSE at catch error"); 
      console.error(error);
      // エラー処理
    } finally {
      setIsLoading(false);
      // ローディングは解除
    }
  };
  const handleSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get('content');
    if (!content || content.toString().trim() === '') {
      toast.error("コメントがありません！");
    } else {
      try {
        await addComment(formData, {reportId});
        toast.success("コメントを追加しました");
        router.push("/")
      } catch (error) {
        console.error(error);
        toast.error("コメントの追加に失敗しました(サインインしてください!)");
      }
    }
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleChatGPTSubmit}>
        <div>
          <label htmlFor="content" className="block text-m font-medium text-gray-700">ChatGPTで上記日報へのコメントを作成する...</label>
          <label className="block text-sm font-s text-white">感情や単語を多く入れるとより詳しく作成できます。</label>
          <textarea placeholder="単語を複数入力するとコメントが作成できます..." name="contentGPT" className="mt-1 w-full border border-gray-300 p-2 rounded-md" rows={1}></textarea>
        </div>
        <Button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
        {isLoading ? "処理中..." : "ChatGPTでコメントを作成する"}
        </Button>
      </form>
      <form className="space-y-4" onSubmit={handleSubmitComment}>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">コメントする...</label>
          <textarea defaultValue={chat} name="content" className="mt-1 w-full border border-gray-300 p-2 rounded-md" rows={4}></textarea>
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
          コメントを追加
        </Button>
      </form>
    </div>
  );
}
