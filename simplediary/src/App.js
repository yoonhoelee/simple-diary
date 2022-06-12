import './App.css';
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
const dummyList=[
    {
        id:1,
        author:"이윤회",
        content: "yeah",
        emotion: 5,
        created_date: new Date().getTime()
    },
    {
        id:2,
        author:"Adam",
        content: "yeah 1",
        emotion: 4,
        created_date: new Date().getTime()
    }
]
function App() {
  return (
    <div className="App">
        <DiaryEditor/>
        <DiaryList diaryList={dummyList}/>
    </div>
  );
}

export default App;
