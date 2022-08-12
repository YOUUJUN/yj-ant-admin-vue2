import request from "@/utils/http";

export function postAction(url, parameter) {
    return request({
        url,
        method: "post",
        data: parameter,
    });
}

export function getAction(url, parameter) {
    return request({
        url,
        method: "get",
        data: parameter,
    });
}
