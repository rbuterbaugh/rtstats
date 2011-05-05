var activeUsers=0;
var pageCount={};

var socket = new io.Socket('localhost',{ port: 8080 });
socket.connect();
socket.on('message',
	  function(data) {
	    var dataObj=eval('('+data+')');
	    var uniqueId=hex_md5(dataObj.ip+dataObj.useragent);
	    var obj=$("#current-connection-"+uniqueId);
	    if (obj.size() == 0) {
	      activeUsers++;
	      $("#active-users").html(activeUsers);
	      $("#current-connections").append('<div id="current-connection-'+uniqueId+'" rel="'+curTime()+'">'+dataObj.ip+'</div>');
	    } else {
	      obj.attr("rel",curTime());
	    }

	    var urlWithoutQueryStringParts=dataObj.url.split("?");
	    var urlWithoutQueryString=urlWithoutQueryStringParts[0];
	    var urlHash=hex_md5(urlWithoutQueryString);
	    var urlObj=$("#popular-page-"+urlHash);
	    if (urlObj.size() == 0) {
	      $("#popular-pages").append('<div id="popular-page-'+urlHash+'" rel="'+curTime()+'">'+urlWithoutQueryString+'&nbsp;&nbsp;(<span class="page-count">1</span>)</div>');
	    } else {
	      urlObj.attr("rel",curTime());
	    }

	    pageCount[uniqueId]=urlHash;

	    if (dataObj.referer && dataObj.referer != "-" && dataObj.referer.indexOf("http://www.wabble.org") == -1 &&
		dataObj.referer.indexOf("http://wabble.org") == -1) {
	      $("#recent-referers").append('<div>'+dataObj.referer+'</div>');
	    }
	  }
	 );

var updatePageCountsInt=setInterval(updatePageCounts,1000);

function updatePageCounts() {
  $(".page-count").html("0");
  for (var i in pageCount) {
    var obj=$("#popular-page-"+pageCount[i]);
    if (obj.size() > 0) {
      var countObj=obj.find(".page-count");
      countObj.html(parseInt(countObj.html(),10)+1);
    }
  }
}

var updateHostsInt=setInterval(updateHosts,1000);

function updateHosts() {
  $("#current-connections DIV").each(function() {
				       if (!$(this).hasClass("host-updated")) {
					 $(this).addClass("host-updated").load("ip2host.php?"+$(this).html());
				       }
				     }
				    );
}

var removeCurConnsInt=setInterval(removeCurConns,1000);

function removeCurConns() {
  $("#current-connections DIV").each(function() {
				       var added=$(this).attr("rel")-0;
				       if (curTime() - added > 20) {
					 $(this).remove();
					 activeUsers--;
					 $("#active-users").html(activeUsers);
				       }
				     }
				    );
}

var removePagesInt=setInterval(removePages,1000);
function removePages() {
  $("#popular-pages DIV").each(function() {
				 var added=$(this).attr("rel")-0;
				 if (curTime() - added > 20) {
				   $(this).remove();
				 }
			       }
			      );
}

function curTime() {
  return parseInt(new Date().getTime()/1000,10);
}
