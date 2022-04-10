const xpath = require("xpath-html");

class MomoWebhookService {
  constructor() {}

  processHtml = (html) => {
    try {
      const group = xpath
        .fromPageSource(html)
        .findElement("//table[1]/tbody/tr/td/table/tbody/tr/td/table/tbody");
      const group2 = xpath
        .fromNode(group)
        .findElement("//tr[1]/td/table/tbody");
      const group3 = xpath
        .fromNode(group2)
        .findElement("//tr[8]/td/table/tbody");

      return {
        amount: parseFloat(this.getInfoFromNode(group3, 1).replace(".", "")),
        senderName: this.getInfoFromNode(group3, 2),
        senderPhone: this.getInfoFromNode(group3, 3),
        time: this.getInfoFromNode(group3, 4),
        message: this.getInfoFromNode(group3, 5),
        transactionId: this.getInfoFromNode(group3, 6),
      };
    } catch (e) {
      // TODO: send to Sentry...
      console.log("Error processHtml:", e);
      return false;
    }
  };

  getInfoFromNode(node, index) {
    const group = xpath.fromNode(node).findElement(`//tr[${index}]`);
    const group2 = xpath.fromNode(group).findElement("//td[2]/div");
    return group2.getText().trim();
  }
}

module.exports = { MomoWebhookService };
