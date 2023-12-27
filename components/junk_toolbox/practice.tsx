// props練習・チートシート
export const ChildComponent = (props: { name: string; age: number; isAvailable: boolean;}) => {
    let newage = props.age;
    // ここで name と age を使用できる
    if (props.isAvailable === false) {
// props.age = props.age + 10 これはできない。props.{変数}を変更したいなら他に変数を新しく作って代入、そっちを使う
        newage + 10;
    }
    return <div>{props.name} is {newage} years old.</div>;
};

/*
import { ChildComponent } from "@components/practice";

interface User {
    name: string;
    age: number;
    isAvailable: boolean;
}

const gakuto: User = {
    name: "Gakuto",
    age: 23,
    isAvailable: false,
  };

// 先にexportした方が分かりやすい
export default function ParentComponent_as_a_Page() {
    return (
    <div>
      <p>
        <ChildComponent name="Alice" age={25} isAvailable = {false}/>
      </p>
      <p>
        <ChildComponent {...gakuto} />
      </p>
    </div>
    );
}

加工する時、propsは一旦別の変数に移してから。
1. 条件付きレンダリング
プロップスに基づいて異なるコンポーネントや要素を表示する：

jsx
Copy code
const Greeting = (props: { isLoggedIn: boolean }) => {
  if (props.isLoggedIn) {
    return <div>Welcome back!</div>;
  } else {
    return <div>Please sign in.</div>;
  }
};

2. データのフォーマット
日付や数値など、プロップスで受け取ったデータを特定のフォーマットに変換して表示する：

jsx
Copy code
const DateComponent = (props: { date: Date }) => {
  const formattedDate = props.date.toLocaleDateString();
  return <div>{formattedDate}</div>;
};

3. 計算された値
プロップスの値に基づいて計算を行い、その結果を表示する：

jsx
Copy code
const PriceComponent = (props: { price: number; taxRate: number }) => {
  const totalPrice = props.price + (props.price * props.taxRate);
  return <div>Total Price: {totalPrice.toFixed(2)}</div>;
};

4. リストのフィルタリングやソート
プロップスで受け取ったリストをフィルタリングやソートしてから表示する：

jsx
Copy code
const TodoList = (props: { todos: Todo[]; completedOnly: boolean }) => {
  const filteredTodos = props.completedOnly
    ? props.todos.filter(todo => todo.isCompleted)
    : props.todos;

  return (
    <ul>
      {filteredTodos.map(todo => <li key={todo.id}>{todo.title}</li>)}
    </ul>
  );
};

5. スタイルの動的適用
プロップスに基づいて動的にスタイルを適用する：

jsx
Copy code
const Alert = (props: { message: string; type: 'error' | 'info' }) => {
  const style = {
    color: props.type === 'error' ? 'red' : 'blue'
  };
  return <div style={style}>{props.message}</div>;
};
*/