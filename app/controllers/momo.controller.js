const { MomoWebhookService } = require("../services/momoWebhook.service");
const { GoogleService } = require("../services/google.service");
const { MomoService } = require("../services/momo.service");
const { google } = require("googleapis");

class MomoController {
  constructor() {
    this.momoService = new MomoService();
    this.momoWebhookService = new MomoWebhookService();
    this.googleService = new GoogleService();
  }

  webhook = async (req, res, next) => {
    const googleClient = await this.googleService.getRefreshGoogleClient();
    const gmail = google.gmail("v1");

    // Handle webhook message
    console.log("req", req); // TODO: check with Lambda
    // const body = JSON.parse(req.event.body);
    const body = req.body;
    const dataMsg = body.message.data;
    const dataMsgJson = JSON.parse(
      Buffer.from(dataMsg, "base64").toString("ascii")
    );

    // API history
    const historyId = dataMsgJson.historyId;
    const responseHistory = await gmail.users.history.list({
      userId: "me",
      startHistoryId: historyId,
      auth: googleClient,
    });
    if (responseHistory.data.history === undefined) {
      return res.status(200).json({
        success: false,
      });
    }

    // API Message detail
    let responseMessage = null;
    try {
      responseMessage = await gmail.users.messages.get({
        userId: "me",
        id: responseHistory.data.history[0].messages[0].id,
        // id: "17892e4734616092", // TODO: testing
        auth: googleClient,
      });
      console.log(
        "🚀 ~ file: momo.controller.js ~ line 46 ~ MomoController ~ webhook= ~ responseMessage",
        responseMessage
      );
    } catch (e) {
      // Case no message entity
      return res.status(200).json({
        success: false,
      });
    }
    const bodyContent = responseMessage.data.payload.parts[0].body.data;
    const html = Buffer.from(bodyContent, "base64").toString();

    // Process HTML and store
    const dataMomo = this.momoWebhookService.processHtml(html);
    console.log("dataMomo", dataMomo);
    await this.momoService.getModel().create(dataMomo);

    return res.status(200).json({
      success: true,
    });
  };

  queryTransactionId = async (req, res) => {
    const { transId } = req.query;
    if (transId === undefined) {
      return res.status(404).json({
        success: false,
        message: "Transaction Id is not found.",
      });
    }
    const transaction = await this.momoService.find(req.query.transId);
    return res.status(200).json({
      success: true,
      data: transaction,
    });
  };
}

module.exports = new MomoController();
