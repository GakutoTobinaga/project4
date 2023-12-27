import { deleteRepo, fetchReportWithReportId, fetchUsername } from 'lib/actions';
import { Button } from '@tremor/react';
import React from 'react';
import { ReportWithAuthor } from '@lib/types';

const DeleteButtonRepo = async ({ id }: { id: number }) => {
  // セッションユーザー名取得
  const username = await fetchUsername();
  // findUniqueなのでReportWithAuthor[]ではない。
  const sample : ReportWithAuthor | null = await fetchReportWithReportId(id);
  // レポートの作者がセッションユーザーかどうかをチェック
  if (sample && username === sample?.author?.username) {
    console.log("deleteRepo_component: 削除できます");
    return (
      <form action={deleteRepo.bind(null, id)}>
        <Button color='red'>
          削除
        </Button>
      </form>
    );
  } else {
    console.error("deleteRepo_component: 削除不可");
    return (
      <>
      </>
    );
  }
};

export default DeleteButtonRepo;

/*
/lib/actions.ts
export const deleteRepo = async (id: number) => {
  await prisma.report.delete({
    where: {
      id,
    },
  });
  revalidatePath('/');
};
*/

/*
例
import { deleteTodo } from 'lib/actions';

const DeleteButton = ({ id }: { id: number }) => {
  const deleteTodoWithId = deleteTodo.bind(null, id);

  return (
    <form action={deleteTodoWithId}>
      <button className="bg-red-500 px-2 py-1 rounded-lg text-sm text-white">
        削除
      </button>
    </form>
  );
};

export default DeleteButton;
*/