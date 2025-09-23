export default function sort(arr) {
    console.log('sort', arr)

    if (arr.length === 1) {
        return arr
    } else {
        let sl = arr.length/2

        let left = sort(arr.slice(0, sl))
        let right = sort(arr.slice(sl))

        arr = []
        while (left.length > 0) {
            while (right[0] < left[0]) {
                if (right[0] !== arr[arr.length -1]) { // check duplicates from other half
                    arr.push(right[0])
                } else {
                    continue // skip rest of loop iteration if duplicate
                }

                while (right[0] === right[1]) { // remove duplicates from same half
                    right = right.slice(1)
                }
                right = right.slice(1)
            }
            if (left[0] !== arr[arr.length -1]) { // check duplicates from other half
                arr.push(left[0])
            } else {
                continue // skip rest of loop iteration if duplicate
            }

            while (left[0] === left[1]) { // remove duplicates from same half
                left = left.slice(1)
            }
            left = left.slice(1)
        }
        if (right.length > 0) {
            arr.push(...right)
        }
        return arr
    }
}