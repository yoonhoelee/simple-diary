import React, {useCallback, useEffect, useMemo, useReducer, useRef} from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import OptimizeTest from "./OptimizeTest";

const reducer = (state,action) =>{
    switch (action.type){
        case 'INIT' : {
            return action.data
        }
        case 'CREATE' :{
            const created_date = new Date().getTime();
            const newItem = {
                ...action.data,
                created_date
            }
            return [newItem, ...state]
        }
        case "REMOVE" :{
            return state.filter((it)=>it.id != action.targetId);
        }
        case "EDIT":{
            return state.map((it)=>it.id === action.targetId ? {...it, content: action.newContent} : it);
        }
    }
}
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext()

const App = () => {
    // const [data, setData] = useState([]);
    const [data, dispatch] = useReducer(reducer, [])
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
        dispatch({type: "INIT", data: initData});
    };

    useEffect(() => {
        setTimeout(() => {
            getData();
        }, 1500);
    }, []);

    // useCallback으로 프롭스로 원래 2번 호출되던거 막아줌
    const onCreate = useCallback((author, content, emotion) => {
        dispatch({type:'CREATE', data:{author, content, emotion, id:dataId.current}})
        // const created_date = new Date().getTime();
        // const newItem = {
        //     author,
        //     content,
        //     emotion,
        //     created_date,
        //     id: dataId.current
        // };
        dataId.current += 1;
        //여기서 함수형태로 데이터를 전달하지 않으면  onCreate시점에 data가 빈값이기 때문에 새로 저장된 값만 나오게된다
        // setData((data)=>[newItem, ...data]);
    },[]);

    const onRemove = useCallback((targetId) => {
        // setData(data=>data.filter((it) => it.id !== targetId));
        dispatch({type:"REMOVE", targetId});
    },[]);

    const onEdit = useCallback((targetId, newContent) => {
        dispatch({type:"EDIT", targetId, newContent});
        // setData((data)=>
        //     data.map((it) =>
        //         it.id === targetId ? { ...it, content: newContent } : it
        //     )
        // );
    },[]);
    const memoizedDispatches = useMemo(()=>{
        return {onCreate,onRemove, onEdit},[]
    })
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
        <DiaryStateContext.Provider value={data}>
            <DiaryDispatchContext.Provider value={memoizedDispatches}>
                <div className="App">
                    <OptimizeTest/>
                    <DiaryEditor />
                    <div>전체 일기 : {data.length}</div>
                    <div>기분 좋은 일기 개수: {goodCount}</div>
                    <div>기분 나쁜 일기 개수: {badCount}</div>
                    <div>기분 좋은 일기 비율: {goodRatio}</div>
                    <DiaryList />
                </div>
            </DiaryDispatchContext.Provider>
        </DiaryStateContext.Provider>

    );
};
export default App;

