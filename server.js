const amqp = require("amqplib");
const { v4: uuid } = require("uuid")();

const argv = process.argv.slice(2);
const queueName = "grpc";

async function proccessToTask() {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    channel.consume(queueName, (msg) => {
        const data = parseInt(msg.content.toString());
        let temp = 0;
        for (let index = 0; index < 10; index++) {
            temp += data * index;
        }
        channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(temp.toString())
        );
        channel.ack(msg);
    });
}

proccessToTask();
