// 获取查询参数
function getQueryVariable(variable) {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get(variable)
    return param ? param : '';
}

// 转换链接为original
function thumbToOriginal(link) {
    return link.replace(/c\/250x250_80_a2\/img-master\/img/, 'img-original/img')
        .replace(/_square1200\.jpg$/, '.jpg');
}

// 限制格式
function validateParam(str) {
    const regex = /^(?!(?:.*--))(\d+(?:-\d+)?|$)/;
    return regex.test(str);
}

// 得到序号
function getNumbers(str) {
    if (str != '') {
        const regex = /^(\d+)-(\d+)$/;
        const match = str.match(regex);
        return match ? {
            pid: parseInt(match[1]),
            num: parseInt(match[2])
        } : null;
    }
}

const param = getQueryVariable("pid");
console.log(param);

if (validateParam(param)) {
    let pid, num;
    const numbers = getNumbers(param);
    if (numbers) {
        pid = numbers.pid;
        num = numbers.num;
    } else {
        pid = param;
        num = null;
    }

    console.log(pid);
    console.log(num);

    if (pid) {
        console.log(1)
        const api = 'https://pximg.hakurei.cc/ajax/illust/';
        const url = api + pid;
        $.ajax({
            url,
            type: "GET",
            dataType: "json",
            success: (data) => {
                const originalUrl = thumbToOriginal(data.userIllusts[pid].url);
                const pageCount = data.userIllusts[pid].pageCount;
                console.log(data);
                console.log(originalUrl);
                console.log(pageCount);

                if (num !== null) {
                    if (num <= pageCount - 1) {
                        const newUrl = originalUrl.replace(/_p\d+\./, `_p${num}.`);
                        console.log(newUrl);
                        if (newUrl) {
                            jpgOrPng(newUrl);
                        } else {
                            alert('url为空');
                        }
                    } else {
                        alert("序号不存在");
                        window.location.replace(window.location.href.split('?')[0]);
                    }
                } else {
                    if (originalUrl) {
                        jpgOrPng(originalUrl);
                    } else {
                        alert('url为空');
                    }
                }
            }
        });
    }
}
else {
    console.log(param)
    alert("请输入正确格式");
    window.location.replace(window.location.href.split('?')[0]);
}


// 监测jpg能否加载，不能加载修改为png
function jpgOrPng(url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        window.location.replace(url);
    };
    img.onerror = () => {
        const newUrl = url.replace(/\.jpg$/, '.png');
        window.location.replace(newUrl);
    };
}

