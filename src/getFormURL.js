const fetch = require('node-fetch')

async function getFormURL (credentials) {
  // Função que pega o token de sessão.
  const token = await fetch("https://cmspweb.ip.tv/", {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({
              "realm": "edusp",
              "platform": "webclient",
              "username": credentials.ra + credentials.digit + credentials.uf,
              "password": credentials.code
          })
      }).then((res) => {
        try {
          return res.headers.get('set-cookie').split('session=')[1].split(';')[0]
        }
        catch (err) {
          console.log(err);
          return { response: err, statusCode: '500' }
        }
      });
      
      if (!token) return { response: 'Usuário inexistente.', statusCode: '404' }

      const rooms = await fetch("https://cmspweb.ip.tv/g/getRoomsList", {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "cookie": 'session=' + token + ';'
          },
          method: "POST",
          body: JSON.stringify({
              'data': 'getRoomsList'
          })
      }).then((res) => res.json());
  
      const info = await fetch("https://cmspweb.ip.tv/g/getInitial", {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "cookie": 'session=' + token + ';'
          },
          method: "POST",
          body: JSON.stringify({
              'data': 'getInitial'
          })
      }).then((res) => res.json());
  
      const link = `https://cmsp-tms.ip.tv/user?auth_token=${info.auth_token}&room=${rooms.data.rooms[0].name}`
      return { response: link, statusCode: '200' }
}

module.exports = { getFormURL }