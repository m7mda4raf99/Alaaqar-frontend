
export function filterData(key: string, formDataArray: any) {
    return formDataArray.map((val: any) => {
        if (val.name_en === key) {
            return val?.options
        }
    })
}

export function getFilteredValues(valueName: string, formDataArray: any) {
    const row = formDataArray.filter((val: any) => val.name_en === valueName)
    return row[0]?.options ? row[0]?.options : []
}

/********** remove white spaces if exit *******/
export function ignoreWhiteSpaces(str: string): string {
    return str.replace(/\s/g, "").toLocaleLowerCase();
  }

