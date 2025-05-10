import { VercelRequest, VercelResponse } from "@vercel/node";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const data = req.body;

    const command = new PutItemCommand({
      TableName: "TuyaData",
      Item: {
        deviceId: { S: data.device_id },
        timestamp: { S: new Date().toISOString() },
        payload: { S: JSON.stringify(data) },
      },
    });

    await client.send(command);
    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to insert data" });
  }
}
