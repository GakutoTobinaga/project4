// app/api/auth/[...nextauth].ts
// https://stackoverflow.com/questions/76298505/my-next-js-app-isnt-building-and-returing-a-type-error-how-do-i-fix
import NextAuth from 'next-auth';
import { authOptions } from 'auth/auth-config';

const handler =  NextAuth(authOptions);

export { handler as GET, handler as POST}
// [...nextauth]/route.tsからはHTTPメソッドのみexportできるので、sessionなどで再利用したいなら別ファイルで定義する