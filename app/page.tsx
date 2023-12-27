import { getReports } from '@lib/actions';
import YouLoggedInAs from '@components/youloggedinas';
import ReportTable from '@components/ReportTable';
import SearchBox from '@components/SearchBox';

const repopage = async ({ searchParams }: { searchParams: { q: string }; }) => {
  const reports = await getReports(searchParams.q)
  return (
  <>
    <div className="m-8">
      <div className='space-x-10'>
      <YouLoggedInAs/>
      </div>
      <div className="flex-auto w-64">
        <div className='m-auto'>
          <SearchBox/>
        </div>
      </div>
      <div className="mt-2">
        <ReportTable tableTitle="投稿一覧" reportInformations={reports} />
      </div>
    </div>
  </>
  );
};

export default repopage;
