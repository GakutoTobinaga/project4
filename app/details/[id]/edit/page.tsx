import { fetchReportWithReportId, updateReportX } from '@lib/actions';
import Link from 'next/link';
import { Text, Button, TextInput, Textarea } from '@tremor/react';

export default async function edit({ params }: { params: { id: string } }) {
  const id = params.id
  // idが文字列であることを確認
  if (typeof id !== 'string') {
    // idが文字列でない場合の処理（エラーハンドリングなど）
    return {
      props: {
        error: "Invalid ID",
      },
    };
  }

  const report = await fetchReportWithReportId(parseInt(id));
  const updateReportWithId = await updateReportX.bind(null, parseInt(id))
  
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <div>
            <label htmlFor="toggelme" className="block text-xl font-large text-gray-700">
              日報を更新
            </label>
          </div>
          <Text
            className="block text-sm font-medium text-gray-700"
          >
            状態: {report?.isPosted ? "投稿済" : "下書き"}
          </Text>
          <Link href={`/details/${report?.id}`}>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-4"
            >
              戻る
            </Button>
          </Link>
          <form className="space-y-4" action={updateReportWithId}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title:
              </label>
              <TextInput
                type="text"
                name="fixedTitleByUser"
                defaultValue={report?.title}
                className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content:
              </label>
              <Textarea
                name="fixedContentByUser"
                defaultValue={report?.content}
                className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                rows={4}
                required
              />
            </div>
            <div>
              <div className="block text-sm font-small text-gray-400">
                *255文字まで入力できます*
              </div>
            </div>
            <select
              name="fixedIsPostedByUser"
              id="status"
              className="w-64 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded-md"
            >
              <option value="submitted">投稿済</option>
              <option value="draft">下書き</option>
            </select>
            <div className="max-w-sm mx-auto space-y-6">
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
              更新・状態を切り替え
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
