// type, interface宣言ファイル
// sessionの拡張もここで
import "next-auth";

// Prismaのuserテーブルからの"username"をsessionに入れる。
// デフォルトではuserにはuser, email, imageしかない
declare module "next-auth" {
  interface Session {
    neouser: {
      username: string;
    };
  }
}

export interface CommentFormProps {
  reportId: number | undefined; // または string やその他適切な型
};