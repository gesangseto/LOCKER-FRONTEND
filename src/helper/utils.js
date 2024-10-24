const secretKey = 'Initial-G';
const crypto = require('crypto');
export const capitalize = (str) => {
    if (!str) return '';
    const words = str.toString().split(' ');
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
};

export const isBoolean = (str = '') => {
    try {
        str = str.toString();
        if (str.toUpperCase() === 'TRUE' || str.toUpperCase() === 'FALSE') {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const titleCapitalize = (str) => {
    if (!str) return '';
    str = str.replace(/-/g, ' ');
    return capitalize(str);
};

// Fungsi untuk mengenkripsi data
export const encryptData = (data) => {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
};

// Fungsi untuk mendekripsi data
export const decryptData = (encryptedData) => {
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    let res = JSON.parse(decryptedData);
    return res;
};

export const gs1CheckDigit = (input) => {
    let array = input.split('').reverse();
    let total = 0;
    let i = 1;
    array.forEach((number) => {
        number = parseInt(number);
        if (i % 2 === 0) {
            total = total + number;
        } else {
            total = total + number * 3;
        }
        i++;
    });
    return Math.ceil(total / 10) * 10 - total;
};

export const humanizeText = (str) => {
    if (!str) return '';
    var i,
        frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
};

export const treeify = (list, idAttr, parentAttr, childrenAttr) => {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parent';
    if (!childrenAttr) childrenAttr = 'children';

    var treeList = [];
    var lookup = {};
    list.forEach(function (obj) {
        lookup[obj[idAttr]] = obj;
        obj[childrenAttr] = [];
    });
    list.forEach(function (obj) {
        if (obj[parentAttr] != null) {
            if (lookup[obj[parentAttr]] !== undefined) {
                lookup[obj[parentAttr]][childrenAttr].push(obj);
            } else {
                treeList.push(obj);
            }
        } else {
            treeList.push(obj);
        }
    });

    const removeEmptyChild = (arr = Array) => {
        let newData = [];
        for (const it of arr) {
            if (it.items.length > 0) {
                it.items = removeEmptyChild(it.items);
            } else {
                delete it.items;
            }
            newData.push(it);
        }
        return newData;
    };
    treeList = removeEmptyChild(treeList);

    return treeList;
};
