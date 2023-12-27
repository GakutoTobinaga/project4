import PostPage from "@components/PostForm"
import { addReport } from "@lib/actions"

export default function MainPost({ params }: { params: { id: string } }) {
    // 後ほどchatgptの機能
    const templateId = Number(params.id)
    return <>
          <PostPage formLabel = "投稿" action={ addReport } templateId={ templateId }/>
          </>
  };

