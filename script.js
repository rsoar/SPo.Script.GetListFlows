var listURL = "/teams/MySite/Lists/SiteList";

function RestRequest(url, params) {
  var req = new XMLHttpRequest();
  return new Promise(function (resolve, reject) {
    req.onreadystatechange = function () {
      if (req.readyState != 4) return;
      if (req.status >= 200 && req.status < 300) {
        resolve(req);
      } else {
        reject({
          status: req.status,
          statusText: req.statusText,
        });
      }
    };

    var webBasedUrl = (
      window._spPageContextInfo.webServerRelativeUrl +
      "//" +
      url
    ).replace(/\/{2,}/, "/");
    req.open("POST", webBasedUrl, true);
    req.setRequestHeader("Content-Type", "application/json;odata=verbose");
    req.setRequestHeader("ACCEPT", "application/json;odata=verbose");
    req.setRequestHeader(
      "x-requestdigest",
      window._spPageContextInfo.formDigestValue
    );
    req.send(params ? JSON.stringify(params) : void 0);
  });
}

RestRequest(
  `/_api/web/GetList(@a1)/SyncFlowInstances?@a1='${listURL}'`,
  null
).then(function (resp) {
  var output = JSON.parse(resp.response);
  var flowinstances = JSON.parse(output.d.SynchronizationData).value;
  for (var i = 0; i < flowinstances.length; i++) {
    console.log(
      "Name: " +
        flowinstances[i].name +
        "\r\nDisplayName: " +
        flowinstances[i].properties.displayName +
        "\r\nEnvironment Name: " +
        flowinstances[i].properties.environment.name +
        "\r\nModified: " +
        flowinstances[i].properties.lastModifiedTime
    );
  }
});
