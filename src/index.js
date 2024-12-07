function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

var pid = getQueryVariable("pid");
console.log(pid);
if (pid != false) {
    var uri = pid;
    $.ajax({
        url: "https://pximg.hakurei.cc/ajax/illust/" + uri,
        async: false,
        type: "GET",
        dataType: "json",
        success: 
            function (data) {
                var url = data.urls.original;
                window.location.replace(url);
        }
    });
}