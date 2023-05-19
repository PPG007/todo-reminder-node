import axios from "axios";

export async function get(url: string, params: object): Promise<object> {
    return new Promise<object>((res, rej) => {
        axios.get(url, {
            params: params,
        }).then((resp) => {
            res(resp.data);
        }).catch((e) => {
            rej(e);
        })
    })
}
