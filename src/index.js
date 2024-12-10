// 获取查询参数
const getQueryVariable = (variable) => {
    return new URLSearchParams(window.location.search).get(variable) || '';
}

// 转换链接为original
const thumbToOriginal = (link) => {
    return link.replace(/c\/250x250_80_a2\/img-master\/img/, 'img-original/img')
        .replace(/_square1200\.jpg$/, '.jpg');
}

// 限制格式
const validateParam = (str) => {
    const regex = /^(?!(?:.*--))(\d+(?:-\d+)?|$)/;
    return regex.test(str);
}

// 得到序号
const getNumbers = (str) => {
    const regex = /^(\d+)-(\d+)$/;
    const match = str.match(regex);
    return match ? {
        id: parseInt(match[1]),
        index: parseInt(match[2])
    } : null;
}

// 加载jpg图片,是否转为png
const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            resolve(url);
        };
        img.onerror = () => {
            reject(url);
        };
    });
}

// 替换 URL
const replaceUrl = (url) => {
    return url.replace(/\.jpg$/, '.png');
}

// 主函数
const main = () => {
    const param = getQueryVariable("pid");
    console.log(param);
    if (param == '') {
        return
    }
    if (!validateParam(param)) {
        alert("请输入正确格式");
        return
    }
    const { id, index } = getNumbers(param) || { id: param, index: null };

    const api = 'https://pximg.hakurei.cc/ajax/illust/';
    const url = `${api}${id}`;

    if (id) {
        $.ajax({
            url,
            type: "GET",
            dataType: "json",
            success: (data) => {
                const originalUrl = thumbToOriginal(data.userIllusts[id].url);
                const pageCount = data.userIllusts[id].pageCount;

                const newUrl = index !== null
                    ? originalUrl.replace(/_p\d+\./, `_p${index}.`)
                    : originalUrl;

                if (newUrl) {
                    if (index !== null && index > pageCount - 1) {
                        alert("无效 序号");
                        return
                    } else {
                        loadImage(newUrl)
                            .then((url) => window.location.replace(url))
                            .catch((url) => window.location.replace(replaceUrl(url)));
                    }
                } else {
                    alert('url为空');
                    return
                }
            },
            error: () => {
                alert("无效 pid")
                return
            }
        });
    }
}

main();



