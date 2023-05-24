const { CRUDService } = require("./crud.service");
const fetch = require("node-fetch");

class TcbService extends CRUDService {
  getNewToken = async (currentRefreshToken) => {
    var details = {
      grant_type: "refresh_token",
      refresh_token: currentRefreshToken,
      client_id: "tcb-web-client",
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await fetch(
      "https://identity-tcb.techcombank.com.vn/auth/realms/backbase/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
      }
    );
    return await response.json();
  };

  getTransaction = async (accessToken, query) => {
    let result = [];
    try {
      const response = await fetch(
        "https://onlinebanking.techcombank.com.vn/api/transaction-manager/client-api/v2/transactions?bookingDateGreaterThan=2022-10-31&bookingDateLessThan=2022-11-06&query=my&from=0&size=1",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      console.log("response", response);

      result =  await response.json();
    } catch (err) {
      console.log("Error", err);
    }
    
    return result;
  };
}

module.exports = { TcbService };
