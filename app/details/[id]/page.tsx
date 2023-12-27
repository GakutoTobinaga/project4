import Link from 'next/link';
import { Button, Card, Flex, Text, Title, Grid, Col } from '@tremor/react';
import { comment } from 'postcss';
import DeleteButtonRepo from '@components/buttons/deleteReportButton';
import prisma from '@lib/prisma';
import { fetchUsername } from '@lib/actions';

export default async function Page({ params }: { params: { id: string } }) {
  let sessionAndReportId: boolean = false
  const id = Number(params.id);
  // 詳細ページ表示のために、レポートをidで検索
  const report = await prisma?.report.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    }
  });
  // 日報IDを使用してコメントを検索
  const comments = await prisma?.comment.findMany({
    where: {
      reportId: id,
    },
    include: {
      author: true, // 各コメントの作者も取得
      report: true,
    }
  });
  if (report?.author.username === await fetchUsername()){
    sessionAndReportId = true;
  }
  
  return (
<div className="flex items-center justify-center h-screen bg-gray-100">
  <Card className="p-8 space-y-4 max-w-md">
    <Title className="text-xl font-bold text-center">詳細</Title>
    <Text>日報ID: {report?.id}</Text>
    <Text>タイトル: {report?.title}</Text>
    <Text>内容: {report?.content}</Text>
    <Text>作成者: {report?.author.username}</Text>
    <Text>作成者Id: {report?.authorId}</Text>
    <Text>状態: {report?.isPosted === true ? "投稿済" : "下書き"}</Text>
    <div className="flex space-x-2 justify-around">
      <Link href="/"><Button>戻る</Button></Link>
      <Link href={`/comments/${report?.id}`}><Button>コメントする</Button></Link>
      {sessionAndReportId && (<Link href={`/details/${report?.id}/edit`}><Button>更新・状態管理</Button></Link>)}
      <DeleteButtonRepo id={id} />
    </div>
    </Card>
    <Card className="p-8 space-y-4 max-w-md">
      <Title className="text-xl font-bold text-center">コメント一覧</Title>
      <Grid numItems={1} className="gap-2">
        {comments?.map((comment) => (
          <Col key={comment.id}>
            <Card className="mb-4">
              <Text className="text-xl">{comment.content.slice(0, 255)}</Text>
              <Text>作成日: {new Date(comment.createdAt).toLocaleString()}</Text>
              <Text>作成者: {comment.author.username}</Text>
            </Card>
          </Col>
        ))}
      </Grid>
    </Card>
</div>

  );
}
