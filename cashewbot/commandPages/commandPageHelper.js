const isAlpha = str => /^[a-zA-Z]+$/.test(str);

const isEmpty = obj => Object.keys(obj).length===0;

module.exports = {
    isAlpha: isAlpha, 
    isEmpty: isEmpty
};