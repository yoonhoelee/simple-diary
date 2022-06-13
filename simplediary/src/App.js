import './App.css';
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import {useRef, useState} from "react";

function App() {
    const [data, setData] = useState([]);
    const dataId = useRef(0);
    const onCreate = (author, content, emotion) => {
        const created_date = new Date().getTime();
        const newItem = {
            author,
            content,
            emotion,
            created_date,
            id: dataId.current
        };
        dataId.current += 1;
        setData([newItem, ...data]);
    };
    const onDelete =(targetId)=>{
        console.log('${targetId}가 삭제되었습니다');
        const newDiaryList = data.filter((it)=> it.id !== targetId);
        console.log(newDiaryList);
        setData(newDiaryList);
    }
    return (
        <div className="App">
            <DiaryEditor/>
            <DiaryList onDelete={onDelete} diaryList={data}/>
        </div>
    );
}

export default App;
