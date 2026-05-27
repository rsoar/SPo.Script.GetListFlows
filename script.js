var listURL = "/teams/MySite/Lists/SiteList";

function RestRequest(url, params) {
  var req = new XMLHttpRequest();
  return new Promise(function (resolve, reject) {
    req.onreadystatechange = function () {
      if (req.readyState != 4) return;
      if (req.status >= 200 && req.status < 300) {
        resolve(req);
      } else {
        reject({ status: req.status, statusText: req.statusText });
      }
    };
    var webBasedUrl = (
      window._spPageContextInfo.webServerRelativeUrl + "//" + url
    ).replace(/\/{2,}/, "/");
    req.open("POST", webBasedUrl, true);
    req.setRequestHeader("Content-Type", "application/json;odata=verbose");
    req.setRequestHeader("ACCEPT", "application/json;odata=verbose");
    req.setRequestHeader("x-requestdigest", window._spPageContextInfo.formDigestValue);
    req.send(params ? JSON.stringify(params) : void 0);
  });
}

(async () => {
  try {
    const resp = await RestRequest(`/_api/web/GetList(@a1)/SyncFlowInstances?@a1='${listURL}'`, null);
    const output = JSON.parse(resp.response);
    const flowinstances = JSON.parse(output.d.SynchronizationData).value;

    if (flowinstances.length === 0) {
      console.log("Nenhum fluxo encontrado para essa lista.");
      return;
    }

    console.log(`Total de fluxos encontrados: ${flowinstances.length}\n`);
    console.table(flowinstances.map(f => ({
      DisplayName: f.properties.displayName,
      Modified: f.properties.lastModifiedTime,
      URL: `https://make.powerautomate.com/environments/${f.properties.environment.name}/flows/${f.name}`
    })));

  } catch (err) {
    console.error("Erro na requisição:", err);
  }
})();
