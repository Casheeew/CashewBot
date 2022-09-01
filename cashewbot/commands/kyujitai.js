const Kyujitai = require('kyujitai')

function convertKyujitaiShinjitai(message, fn) {
const kyujitai = new Kyujitai ((error) => {
    fn(kyujitai.encode(message))
  }
)
}

exports.convertKyujitaiShinjitai = convertKyujitaiShinjitai