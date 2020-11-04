export async function addOne(a: number): Promise<number> {
    return a + 2
}

export function fn(n: number) {
    if (n > 5) {
        return true;
    } else {
        return false;
    }
}