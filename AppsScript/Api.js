const Api = {

  post(endpoint, dados) {

    const resposta = UrlFetchApp.fetch(

      CONFIG.API.URL + endpoint,

      {

        method: "post",

        contentType: "application/json",

        payload: JSON.stringify(dados),

        muteHttpExceptions: true

      }

    );

    return JSON.parse(

      resposta.getContentText()

    );

  }

};