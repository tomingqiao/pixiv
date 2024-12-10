// 获取查询参数
const getQueryVariable = (variable) => {
    return new URLSearchParams(window.location.search).get(variable) || '';
}

// 转换链接为original
const thumbToOriginal = (link) => {
    const regex = /c\/250x250_80_a2\/(custom-thumb|img-master)\/img\/(\d{4})\/(\d{2})\/(\d{2})\/(\d{2})\/(\d{2})\/(\d{2})\/(\d+)_(\d+)(_square1200)?\.jpg/;
    const match = link.match(regex);
    if (match) {
        const year = match[2];
        const month = match[3];
        const day = match[4];
        const hour = match[5];
        const minute = match[6];
        const second = match[7];
        const id = match[8];
        const index = match[9];
        return `https://i.pixiv.re/img-original/img/${year}/${month}/${day}/${hour}/${minute}/${second}/${id}_p${index}.jpg`;
    } else {
        return link;
    }
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



