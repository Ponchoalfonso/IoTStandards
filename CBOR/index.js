const cbor = require('cbor');
const assert = require('assert');

function memorySizeOf(object) {

  let objectList = [];

  let recurse = function (value) {
    let bytes = 0;

    if (typeof value === 'boolean') {
      bytes = 4;
    } else if (typeof value === 'string') {
      bytes = value.length * 2;
    } else if (typeof value === 'number') {
      bytes = 8;
    } else if (
      typeof value === 'object' &&
      objectList.indexOf(value) === -1
    ) {
      objectList[objectList.length] = value;

      for (i in value) {
        bytes += 8; // an assumed existence overhead
        bytes += recurse(value[i])
      }
    }

    return bytes;
  }

  return recurse(object);
}

function formatByteSize(bytes) {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
  else return (bytes / 1073741824).toFixed(3) + " GiB";
};

function sizeImprovement(newSize, oldSize) {
  return (oldSize - newSize) / oldSize * 100;
}

let myJson = {
  name: 'Alfonso',
  lastname: 'Valencia',
  secondLastname: 'Sandoval',
  age: 21,
  birthDate: new Date('April 7, 1999'),
}

let encoded = cbor.encode(myJson);

let oSize = memorySizeOf(Buffer.from(JSON.stringify(myJson)));
let nSize = memorySizeOf(encoded);

let improvement = sizeImprovement(nSize, oSize);

console.log(`Original JSON size: ${formatByteSize(oSize)}`);
console.log(`CBOR encoded object size: ${formatByteSize(nSize)}`);
console.log(`CBOR objects has improved the size in ${improvement.toFixed(2)}% over the JSON object.`);