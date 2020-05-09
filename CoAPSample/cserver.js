const cserver = require('coap-shepherd');

const resources = [
  '/temperature/0',
  '/lightCtrl/0',
]

// The ready event is fired when the server starts working
cserver.on('ready', function () {
  console.log('Server is ready.');

  // Devices are permitted to join during the next 2 minutes
  cserver.permitJoin(180);
});

// The "indication message" event (ind for short) is fired when one of the 
// 5 indication messages is triggered.
// Check https://github.com/PeterEB/coap-shepherd/wiki#EVT_ind to check all the indication message
cserver.on('ind', (message) => {
  if (message.type === 'devUpdate') {
    const cnode = message.cnode;

    console.log(`\nNode ${cnode.clientName} update:`)
    for (const resource of resources) {
      cnode.readReq(resource, (err, res) => {
        if (+res.status < 4) {
          console.log(res.data);
        }
      });
    }
  }

});

// Starting the server
cserver.start(function (err) {
  if (err)
    console.log(err);
});