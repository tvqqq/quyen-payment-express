const {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

class DdbService {
  constructor() {
    // Create an Amazon DynamoDB service client object.
    this.ddbClient = new DynamoDBClient({ region: "ap-southeast-1" });
  }

  getKey = async (key) => {
    let value = null;
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        key: { S: key },
        group: { S: "techcombank" },
      },
      ProjectionExpression: "string_value",
    };

    try {
      const { Item } = await this.ddbClient.send(new GetItemCommand(params));
      value = unmarshall(Item);
      value = value.string_value || null;
    } catch (err) {
      console.log("Error", err);
    }

    return value;
  };

  updateKey = async (key, value) => {
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        key: { S: key },
        group: { S: "techcombank" },
      },
      UpdateExpression: "set string_value = :v",
      ExpressionAttributeValues: {
        ":v": marshall(value),
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      await this.ddbClient.send(new UpdateItemCommand(params));
    } catch (err) {
      console.log("Error", err);
    }

    return true;
  };
}

module.exports = { DdbService };
