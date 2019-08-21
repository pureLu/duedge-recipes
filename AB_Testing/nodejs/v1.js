const COOKIE_EXPERIMENT_A = 'X-Experiment-Name=A';
const COOKIE_EXPERIMENT_B = 'X-Experiment-Name=B';
const PATH_EXPERIMENT_A = '/experiment-A';
const PATH_EXPERIMENT_B = '/experiment-B';

async function f(event) {
    let request = event.request;

    if (request.uri !== '/experiment') {
        return request;
    }

    let headers = request.headers;
    let experimentUri;

    // 多值
    if (typeof headers.cookie === 'object') {
        // "cookie":["cookie1","cookie2", .... , "cookieN"]
        for (let i = 0; i < headers.cookie.length; i++) {
            if (headers.cookie[i].indexOf(COOKIE_EXPERIMENT_A) >= 0) {
                experimentUri = PATH_EXPERIMENT_A;
                break;
            } else if (headers.cookie[i].indexOf(COOKIE_EXPERIMENT_B) >= 0) {
                experimentUri = PATH_EXPERIMENT_B;
                break;
            }
        }
    } else if (typeof headers.cookie === 'string') {
        if (headers.cookie.indexOf(COOKIE_EXPERIMENT_A) >= 0) {
            experimentUri = PATH_EXPERIMENT_A;
        } else if (headers.cookie.indexOf(COOKIE_EXPERIMENT_B) >= 0) {
            experimentUri = PATH_EXPERIMENT_B;
        }
    }

    if (!experimentUri) {
        if (Math.random() < 0.75) {
            experimentUri = PATH_EXPERIMENT_A;
        } else {
            experimentUri = PATH_EXPERIMENT_B;
        }
    }

    request.uri = experimentUri;

    return request;
}

exports.handler = f;