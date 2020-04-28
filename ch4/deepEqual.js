

function deepEqual(value1, value2){
    if ((typeof(value1) == "object" && value1 != null) && 
        (typeof(value2) == "object" && value2 != null)){
        let value1_prop = Object.keys(value1);
        let value2_prop = Object.keys(value2);

        if(value1_prop.length != value2_prop.length) return false;
        else {
            for (let prop of value1_prop){
                if(!value2_prop.includes(prop) || !deepEqual(value1[prop], value2[prop])) return false;
            }
            return true;
        }
    }
    if(value1 === value2) return true;

}
    
   let obj = {here: {is: "an"}, object: 2};
   console.log(deepEqual(obj, obj));
   // → true
   console.log(deepEqual(obj, {here: 1, object: 2}));
   // → false
   console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
   // → true
   