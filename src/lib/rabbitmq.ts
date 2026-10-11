import amqp from 'amqplib';

const globalForRabbit = globalThis as unknown as {
	rabbitChannel: amqp.Channel | undefined;
};

// init connection to RabbitMQ
async function getRabbitChannel() {
	if (globalForRabbit.rabbitChannel) return globalForRabbit.rabbitChannel;

	try {
		// 1. connect to broker
		const connection = await amqp.connect(process.env.RABBITMQ_URL!);
		// 2. create channel inside connection (it works through channels)
		const channel = await connection.createChannel();

		// 3. make sure we have queue. if not -> create
		// durable: true queue won't go away if we kill Docker
		await channel.assertQueue('upload_batches', { durable: true });

		// store channel to global object
		globalForRabbit.rabbitChannel = channel;

		console.log('[RabbitMQ] connected');
		return channel;
	} catch (error) {
		console.error('[RabbitMQ] Error during connecting:', error);
		throw error;
	}
}

// send task to the queue
export async function sendToQueue(queueName: string, message: object) {
	try {
		const ch = await getRabbitChannel();

		// transform JSON-object to binary buffer
		const payload = Buffer.from(JSON.stringify(message));

		// Send message to queue
		// persistent: true makes RabbitMQ store message to the disk
		ch.sendToQueue(queueName, payload, { persistent: true });

		console.log(
			`[RabbitMQ] Message pushed to the queue "${queueName}":`,
			message
		);
		return true;
	} catch (error) {
		console.error(
			`[RabbitMQ] Couldn't send message to the queue "${queueName}":`,
			error
		);
		return false;
	}
}
