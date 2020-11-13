export function randomNumBetween(min: number, max: number): number {
    return min + Math.random() * (max - min)
}

export function makeid(length: number): string {
    let result = ""
    const characters =
        "0123456789"
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}