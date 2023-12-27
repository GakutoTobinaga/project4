import Link from 'next/link';
import { Button, Card, Grid, Text, Title, Col } from '@tremor/react';
import CommentForm from '@components/addCommentForm';
import { fetchIdWithUsername, fetchReportWithReportId } from '@lib/actions';

export default async function Page({ params }: { params: { id: string } }) {
  let isAuthorized : boolean = false
  const id = Number(params.id);
  const report = await fetchReportWithReportId(id);
  const userId = await fetchIdWithUsername();
  if(report.authorId === userId){
    // reportのauthorIdとsessionのユーザーIDが一緒ならtrue
    isAuthorized = true
  }
  console.log("user Authorized!")
  const reportId = report?.id
  // ダミーの値を入れておいて通す？
  const items = [
    {
      label: "日報ID",
      value: report?.id,
    },
    {
      label: "日報タイトル",
      value: report?.title,
    },
    {
      label: "内容",
      value: report?.content,
    },
    {
      label: "作成者ID",
      value: report?.authorId,
    },
    {
      label: "作成者",
      value: report?.author.username,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 space-y-4">
      <Card className="p-8 space-y-4 max-w-md">
        <Title className="text-xl font-bold text-center">詳細</Title>
        <Grid numItems={2} className="gap-2">
          {items.map((item) => (
            <Text key={item.label}>{item.label}: {item.value}</Text>
          ))}
        </Grid>
        <Col>
          {reportId !== undefined && isAuthorized === true && <Link href={`/details/${report?.id}/edit`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-4">
              更新
            </Button>
          </Link>}
        </Col>
      </Card>
      <Card className="p-8 space-y-4 max-w-md">
        {reportId !== undefined && <CommentForm reportId={reportId} />}
        <Link href={`/details/${report?.id}`}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-4 flex justify-center items-center space-x-2">
            <span>コメント一覧</span>
          </Button>
        </Link>
      </Card>
    </div>
  );
}
