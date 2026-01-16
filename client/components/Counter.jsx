// counter
import React, {useState} from 'react';

function Counter(){
    const [count, setCount]=useState(0);


    const increment=()=>{
        setCount((prev)=> prev+1);
    }
    const decrement=()=>{
        setCount((prev)=>prev-1);
    }
    const reset=()=>{
        setCount(0);
    }

    return (
        <div>
            <h2 class="text-blue-500 font-bold bg-red-500 sm:bg-amber-50 lg:bg-amber-500 md:bg-purple-500
            border border-2 border-transparent hover:border-purple-400 transition
            rounded-3xl p-2">计数器</h2>
            <div>{count}</div>
            <div class="grid grid-cols-3 gap-2">
                <button class="hover:bg-purple-500" onClick={increment}>+</button>
                <button onClick={reset}>清零</button>
                <button onClick={decrement}>-</button>
            </div>
        </div>
    );
}

export default Counter;