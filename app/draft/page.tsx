import PostPage from "@components/PostForm"
import { addDraft } from "@lib/actions"

export default function MainPost() {
    return <PostPage formLabel = "下書き" action={ addDraft }/>
  };
