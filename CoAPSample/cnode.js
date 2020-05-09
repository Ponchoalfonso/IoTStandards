const SmartObject = require('smartobject');
const CoapNode = require('coap-node');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// initialize Resources that follow IPSO definition
let so = new SmartObject();

// initialize resources
// oid = 'temperature', iid = 0
so.init('temperature', 0, {
  sensorValue: 21,
  units: 'C'
});

// oid = 'lightCtrl', iid = 0
so.init('lightCtrl', 0, {
  onOff: false
});

// Instantiate a machine node
let cnode = new CoapNode('some_node', so);

cnode.on('registered', function () {
  console.log("Node registered!");

  setInterval(() => {
    cnode.getSmartObject().set('temperature', 0, 'sensorValue', randomInt(15, 25));
    cnode.update({});
  }, 2000);

});

// register to a Server with its ip and port
cnode.register('localhost', 5683, function (err, rsp) {
  console.log(rsp);
});