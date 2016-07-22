/**
 * Created by afaren on 7/21/16.
 */

'use strict';

function formatTags(tags) {
  return tags.map(tag => {
    let tagPart = tag.split('-');
    return {
      barcode: tagPart[0],
      amount: Number.parseFloat(tagPart[1]) || 1
    };
  });
}

function mergeBarcodes(formattedTags) {
  return formattedTags.reduce((acc, cur) => {
    let found = acc.find(entry => entry.barcode === cur.barcode);
    if (found) {
      found.amount += cur.amount;
    } else {
      acc.push(Object.assign({}, cur));
    }
    return acc;
  }, [])
}

function getBarcodeAmountList(tags) {
  let formattedTags = formatTags(tags);
  let barcodeAmountList = mergeBarcodes(formattedTags);
  return barcodeAmountList;
}

function getPromotingInfo(barcodeAmountList, allPromotions) {
  let promotingInfo = [];
  for (let entry of barcodeAmountList) {
    let found = allPromotions.find(item => item.barcodes.indexOf(entry.barcode) > -1);
    if (found) {
      promotingInfo.push(Object.assign({}, {type: found.type, barcode: entry.barcode}));
    }
  }
  return promotingInfo;

}

function calculateOriginSubTotalCartItems(barcodeAmountList, allItems) {
  return barcodeAmountList.reduce((acc, cur) => {
    let found = allItems.find(item=> cur.barcode === item.barcode);
    acc.push(Object.assign({}, found, {amount: cur.amount, originSubTotal: cur.amount * found.price}));
    return acc;
  }, [])
}

function calculateDiscountedSubTotalCartItems(promotingInfo, originSubTotalCartItems) {
  return originSubTotalCartItems.map(item => {
    let found = promotingInfo.find(entry => entry.barcode === item.barcode);
    if (found) {
      if (found.type === 'BUY_TWO_GET_ONE_FREE') {
        let discountedAmount = item.amount - Math.floor(item.amount / 3);
        return Object.assign({}, item, {discountedSubTotal: discountedAmount * item.price});
      }
    } else {
      return Object.assign({}, item, {discountedSubTotal: item.originSubTotal});
    }

  })


}

function calculateOriginTotalPrice(discountedSubTotalCartItems) {
  return discountedSubTotalCartItems.reduce((acc, item) => acc += item.originSubTotal, 0);
}

function calculateDiscount(discountedSubTotalCartItems) {
  return discountedSubTotalCartItems.reduce((acc, cur)=> {
    return acc += cur.originSubTotal - cur.discountedSubTotal
  }, 0);
}

function formatMoney(price) {
  return price.toFixed(2);
}

function generateReceipt(discountedSubTotalCartItems, originTotalPrice, discount) {
  let header = `***<没钱赚商店>收据***\n`;
  let body = discountedSubTotalCartItems.map(item => {
    return `名称：${item.name}，数量：${item.amount}${item.unit}，单价：${formatMoney(item.price)}(元)，小计：${formatMoney(item.discountedSubTotal)}(元)`
  }).join('\n');

  let footer = `\n----------------------
总计：${formatMoney(originTotalPrice - discount)}(元)
节省：${formatMoney(discount)}(元)
**********************`;

  return `${header}${body}${footer}`;

}
function printReceipt(tags) {
  let allItems = loadAllItems();
  let allPromotins = loadPromotions();
  let barcodeAmountList = getBarcodeAmountList(tags);
  let promotingInfo = getPromotingInfo(barcodeAmountList, allPromotins);
  let originSubTotalCartItems = calculateOriginSubTotalCartItems(barcodeAmountList, allItems);
  let discountedSubTotalCartItems = calculateDiscountedSubTotalCartItems(promotingInfo, originSubTotalCartItems);
  let originTotalPrice = calculateOriginTotalPrice(discountedSubTotalCartItems);
  let discount = calculateDiscount(discountedSubTotalCartItems);
  let receipt = generateReceipt(discountedSubTotalCartItems, originTotalPrice, discount);
  console.log(receipt);
}

