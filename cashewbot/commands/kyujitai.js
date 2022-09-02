const Kyujitai = require('kyujitai')

function convertKyujitaiShinjitai(message, fn) {
const kyujitai = new Kyujitai ((error) => {
    encoded = kyujitai.encode(message)
    if (converted == message) {
      fn(kyujitai.decode(message)) // If original message is Kyujitai, convert to Shinjitai
    } else {
      fn(converted)
    }
  })
}

exports.convertKyujitaiShinjitai = convertKyujitaiShinjitai