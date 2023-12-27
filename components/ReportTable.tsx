import {
    Card,
    Title,
    Text,
    Flex,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableBody,
    Badge,
    Button,
  } from "@tremor/react";
import { ReportWithAuthor } from "@lib/types";
import Link from "next/link";
import TableTemplates from "./tablefortemplates";

  export default async function ReportTable({ reportInformations, tableTitle }: { reportInformations : ReportWithAuthor[] , tableTitle: string | undefined}) {
    const thisTableTitle = tableTitle;
    function truncateString(str: string, num: number):string{
      if (str.length <= num) {
        return str;
      }
      return str.slice(0, num) + '...';
    }

    // 今日の日付を取得（時間部分は無視）
    // もう少しシンプルにできるかもしれない
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時間をリセット

    // 一致するレポートの数をカウント
    const count = reportInformations.reduce((accumulator, info) => {
    const updatedAt = new Date(info.updatedAt);
    updatedAt.setHours(0, 0, 0, 0); // 時間をリセット

    // 今日の日付と一致する場合、カウンターを増やす
    if (updatedAt.getTime() === today.getTime()) {
      accumulator++;
    }
    return accumulator;
    }, 0);

    console.log(`今日更新されたレポートの数: ${count}`);
    
    

    return (
    <>
      <Card>
        <Flex justifyContent="start" className="space-x-2">
        <Title>{thisTableTitle}</Title>
        <Badge color="gray">本日の更新: {count}</Badge>
        </Flex>
        <Table className="mt-6">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Content</TableHeaderCell>
              <TableHeaderCell>Posted</TableHeaderCell>
              <TableHeaderCell>Revised</TableHeaderCell>
              <TableHeaderCell>AuthorName</TableHeaderCell>
              <TableHeaderCell>状態</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportInformations.map(( info: ReportWithAuthor ) => (
              <TableRow key={info.id}>
                <TableCell>{info.title}</TableCell>
                <TableCell>{truncateString((info.content), 10)}</TableCell>
                <TableCell>{new Date(info.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(info.updatedAt).toLocaleString()}</TableCell>
                <TableCell>{info.author.username}</TableCell>
                <TableCell>{(info.isPosted === true) ? "投稿済" : "未投稿"}</TableCell>
                <TableCell>
                <Link href={`/details/${info.id}`}>
                  <Button size="xl" variant="secondary" color="gray">
                    See details
                  </Button>
                </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
    );
  }