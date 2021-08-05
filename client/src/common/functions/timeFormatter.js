
import dayjs from 'dayjs'

export const timeFormatter = (time) => {
    // return false
    if (time) {
        const timeWithDefaultDate = "2021-02-27T" + time
        const formatedTime = dayjs(timeWithDefaultDate).format('LT')
        return formatedTime
    }
}

