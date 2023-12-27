// メインページ ログインしている場合、いない場合で表示を変えるコンポーネント
// signinsignoutとの統合を目指す　
import { fetchUsername } from '@lib/actions';
import Link from 'next/link';

const YouLoggedInAs = async () => {
  const sessionUser = await fetchUsername();

  // ユーザー名が存在するかどうかで条件分岐
  if (sessionUser) {
    // ログインしている場合
    return (
      <div className="mt-8">
        <p className="mb-3">こんにちは。{sessionUser}さん</p>
      </div>
    );
  } else {
    // ログインしていない場合
    return (
      <p>アカウントをお持ちですか？<u className='text-blue-500'><Link href="/login">ログイン</Link></u>して日報を投稿しましょう。</p>
    );
  }
};


export default YouLoggedInAs;
