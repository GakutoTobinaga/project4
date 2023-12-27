import { fetchIdWithUsername } from '@lib/actions';
import TableTemplates from '@components/tablefortemplates';
import ReportTable from '@components/ReportTable';
import { allReportsWithUserId } from '@lib/actions';

const Mypage = async () => {
  let reports: any
  const sessionUserId : number | undefined = await fetchIdWithUsername();
  if (sessionUserId) {
    reports = await allReportsWithUserId();
    console.log("reports are being fetched with userid")
  }

  return (
    <div>
      {sessionUserId ? (
        <div className="m-8">
          <h1 className="text-xl font-bold">あなたの日報一覧</h1>
          <ReportTable tableTitle={ undefined } reportInformations={ reports }/>
          <div className="space-y-2"></div>
          <h1 className="text-xl font-bold">あなたのテンプレート一覧</h1>
          <TableTemplates/>
        </div>
      ) : (
        <div className="m-8">
          <h1 className="text-xl font-bold">ログインしてください...セッションが切れました</h1>
        </div>
      )}
    </div>
  );
};

export default Mypage;