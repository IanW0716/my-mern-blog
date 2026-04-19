import {useState, useEffect, useRef} from 'react';

function useThrottle(value, delay){
    const [tValue, setTvalue] = useState(value);
    const timer = useRef(null);
    const lastTime = useRef(0);
    const savedValue = useRef(value);

    useEffect(()=>{
        let remain = delay - (Date.now()-lastTime.current);
        if(remain <= 0){
            setTvalue(value);
            lastTime.current = Date.now();
        }
        else{
            savedValue.current = value;
            if(!timer.current){
                timer.current = setTimeout(()=>{
                    setTvalue(savedValue.current);
                    lastTime.current = Date.now();
                    timer.current = null;
                }, remain);
            }
        }

    },[value, delay]);

    useEffect(()=>{
        return ()=>{
            if(timer.current){
                clearTimeout(timer.current);
                timer.current = null;
            }
        }
    },[])

    return tValue;
}