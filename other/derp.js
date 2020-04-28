// var twoSum = function(nums, target) {
//     for (let x of nums) {
//         for (let y of nums) {
//             console.log(`${x} at index ${nums.indexOf(x)} and ${y} at ${nums.indexOf(y)}`) // debug
//             if (x+y == target && nums.indexOf(x) != nums.indexOf(y))
//                 return [nums.indexOf(x), nums.indexOf(y)];
//         }
//     }
// };

var twoSum = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < nums.length; j++) {
            if (i != j && nums[i] + nums[j] == target)
                return [i, j];
        }
    }
};

console.log(twoSum([3, 3], 6));