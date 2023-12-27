import PostPage from "@components/PostForm"
import { addReport } from "@lib/actions"

export default function MainPost() {
    // 後ほどchatgptの機能
    return <>
          <PostPage formLabel = "投稿" action={ addReport }/>
          </>
  };

