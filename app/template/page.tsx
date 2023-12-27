import PostPage from "@components/PostForm"
import { addTemplate } from "@lib/actions"

export default function MainPost() {
    return <><PostPage formLabel = "テンプレート" action={ addTemplate }/></>
  };
