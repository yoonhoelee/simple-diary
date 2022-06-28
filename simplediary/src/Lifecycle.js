import React, {useEffect, useState} from "react";

const Lifecycle=()=>{
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");
    useEffect(()=>{
        console.log("Mount!");
    },[])
    useEffect(()=>{
        console.log("Update!")
    });
    useEffect(()=>{
        console.log('count is updated : ${count}');
        if(count>5){
            alert("count should be smaller than 5");
            setCount(1);
        }
    }, [count])
    useEffect(()=>{
        console.log('count is updated : ${text}');
    }, [text])
    return <div style={{padding:20}}>
        <div>
            {count}
            <button onClick={()=>setCount(count+1)}>+</button>
        </div>
        <div>
            <input value={text} onChange={(e)=>setText(e.target.value)}/>
        </div>
    </div>
}
export default Lifecycle;