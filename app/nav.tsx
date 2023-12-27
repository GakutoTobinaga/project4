import Navbar from './navbar';
import { fetchUsername } from '@lib/actions';
import { navigation } from './navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from 'auth/auth-config';
import { Session } from 'next-auth';
// navbarと組み合わせる。serverの処理はこちらで行う
// import { auth } from './api/auth/[...nextauth]/route';

// navでsessionが取れている時だけMypageを表示する, 渡すnavigationを変える。
export default async function Nav() {
  const navigation : navigation[] = [
    { name: 'Timeline', href: '/' },
    { name: 'Post', href: '/addreport' },
    { name: 'Draft', href: '/draft' },
    { name: "Template", href: '/template' },
    { name: 'Register', href: '/register' },
    { name: 'Log in', href: '/login' },
  ];
  const session: Session | null | undefined = await getServerSession(authOptions);
  if (session) {
    // sessionがあったらMypageを追加して、ログインを削除
    navigation.pop();
    navigation.push({ name: 'MyPage', href: '/mypage' });
  }
  // 修正：fetchUsernameはPromiseのため、importでもawaitが必要
  const username = await fetchUsername();
  return <Navbar username={username} navigation2={navigation}/>;
}
