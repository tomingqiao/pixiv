function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

var pid = getQueryVariable("pid");
console.log(pid);
if (pid != false) {
    var api = 'https://pximg.hakurei.cc/ajax/illust/'
    var url = api + pid
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success:
            function (data) {
                var url = data.urls.original;
                if (url == null) {
                    alert('色图, url为空')
                }
                else
                    window.location.replace(url);
            }
    });
}