// gateway-service.js
const Seneca = require('seneca')();
const PORT = 3000;

Seneca.client({ type: 'tcp', port: 3001, pin: { role: 'user' } });
Seneca.client({ type: 'tcp', port: 3002, pin: { role: 'order' } });

Seneca.add({ role: 'gateway', cmd: 'getOrderDetails' }, (msg, respond) => {
  const userId = msg.userId;
  const orderId = msg.orderId;

  Seneca.act({ role: 'user', cmd: 'getUser', userId }, (err, userResult) => {
    if (err) return respond(err);

    Seneca.act({ role: 'order', cmd: 'getOrder', orderId }, (err, orderResult) => {
      if (err) return respond(err);

      const userDetails = userResult.data;
      const orderDetails = orderResult.data;

      respond(null, { success: true, user: userDetails, order: orderDetails });
    });
  });
});

Seneca.listen({ type: 'tcp', port: PORT });
console.log(`Gateway Service is listening on port ${PORT}`);
