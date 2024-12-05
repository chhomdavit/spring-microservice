import dayjs from "dayjs"

export const isEmptyOrNull = (value) => {
    if(value === "" || value === null || value === 'null' || value === undefined){
        return true;
    }
    return false;
}

export const formatDateForClient = (date) => {
    if(!isEmptyOrNull(date)){
        return dayjs(date).format("ថ្ងៃទី​ DD ខែ MM ឆ្នាំ YYYY ម៉ោង​ HH : MM")
    }
    return null
}




