import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import OptimizeTest from "./OptimizeTest";

const App = () => {
    const [data, setData] = useState([]);
    const dataId = useRef(0);

    const getData = async () => {
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/comments"
        ).then((res) => res.json());

        const initData = res.slice(0, 20).map((it) => {
            return {
                author: it.email,
                content: it.body,
                emotion: Math.floor(Math.random() * 5) + 1,
                created_date: new Date().getTime() + 1,
                id: dataId.current++
            };
        });

        setData(initData);
    };

    useEffect(() => {
        setTimeout(() => {
            getData();
        }, 1500);
    }, []);

    // useCallback으로 프롭스로 원래 2번 호출되던거 막아줌
    const onCreate = useCallback((author, content, emotion) => {
        const created_date = new Date().getTime();
        const newItem = {
            author,
            content,
            emotion,
            created_date,
            id: dataId.current
        };
        dataId.current += 1;
        //여기서 함수형태로 데이터를 전달하지 않으면  onCreate시점에 data가 빈값이기 때문에 새로 저장된 값만 나오게된다
        setData((data)=>[newItem, ...data]);
    },[data]);

    const onRemove = useCallback((targetId) => {
        setData(data=>data.filter((it) => it.id !== targetId));
    },[]);

    const onEdit = useCallback((targetId, newContent) => {
        setData((data)=>
            data.map((it) =>
                it.id === targetId ? { ...it, content: newContent } : it
            )
        );
    },[]);
    const getDiaryAnalysis = useMemo(
        ()=>{
        console.log("일기 분석 시작");
        const goodCount = data.filter((it)=>it.emotion >=3).length;
        const badCount = data.length - goodCount;
        const goodRatio = (goodCount/data.length)*100;
        return {goodCount, badCount, goodRatio}
            //data.length가 전달되지 않으면 해당 함수가 호출되지 않는다
    },[data.length]
    );
    // useMemo는 함수가 아니라 값이다
    const {goodCount, badCount, goodRatio} = getDiaryAnalysis;

    return (
        <div className="App">
            <OptimizeTest/>
            <DiaryEditor onCreate={onCreate} />
            <div>전체 일기 : {data.length}</div>
            <div>기분 좋은 일기 개수: {goodCount}</div>
            <div>기분 나쁜 일기 개수: {badCount}</div>
            <div>기분 좋은 일기 비율: {goodRatio}</div>
            <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
        </div>
    );
};
export default App;

