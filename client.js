const amqp = require("amqplib");
const { v4: uuid } = require("uuid")();

const argv = process.argv.slice(2);
const queueName = "grpc";

async function sendTastToProcces() {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertedQueue = channel.assertQueue("", { exclusive: true });
    channel.sendToQueue(queueName, Buffer.from(argv), {
        replyTo: assertedQueue,
        correlationId: uuid,
    });
    channel.consume(assertedQueue, (msg) => {
        if (msg.properties.correlationId == uuid) {
            console.log(msg.content.toString());
            channel.ack(msg);
            setTimeout(() => {
                connection.close();
                process.exit(0);
            }, 1000);
        }
    });
}

sendTastToProcces();
