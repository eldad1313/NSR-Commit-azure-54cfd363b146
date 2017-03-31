export interface ApiMap {
    [name: string]: {
        url: string,
        method: 'get' | 'post',
        mockup?: any,
        errors?: {
            [name: number]: string
        },
        headers?: any
    }
}
