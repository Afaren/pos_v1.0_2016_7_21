/**
 * Created by afaren on 7/21/16.
 */


'use strict';

describe('getPromotingInfo', () => {
  it('should get promoting barcodes information', function () {
    let expected = [
      {
        barcode: 'ITEM000001',
        type: 'BUY_TWO_GET_ONE_FREE'
      },
      {
        barcode: 'ITEM000005',
        type: 'BUY_TWO_GET_ONE_FREE'
      }
    ];
    let barcodeAmountList = [
      {
        barcode: 'ITEM000001',
        amount: 5
      },
      {
        barcode: 'ITEM000003',
        amount: 2.5
      },
      {
        barcode: 'ITEM000005',
        amount: 3
      }

    ];

    let actual = getPromotingInfo(barcodeAmountList, loadPromotions());

    expect(actual).toEqual(expected);

  });
});

describe('getBarcodeAmountList',  () => {
  it('format tags in first step', function () {
    const tags = [
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];
    let actual = formatTags(tags);

    let expected = [
      {
        barcode: 'ITEM000001',
        amount: 1
      },
      {
        barcode: 'ITEM000003',
        amount: 2.5
      },
      {
        barcode: 'ITEM000005',
        amount: 1
      },
      {
        barcode: 'ITEM000005',
        amount: 2
      }
    ];
    expect(actual).toEqual(expected); // cannot use toBe()
  });

  it('merge barcodes in second step', function () {
    let formattedTags = [
      {
        barcode: 'ITEM000001',
        amount: 1
      },
      {
        barcode: 'ITEM000003',
        amount: 2.5
      },
      {
        barcode: 'ITEM000005',
        amount: 1
      },
      {
        barcode: 'ITEM000005',
        amount: 2
      }
    ];

    let actual = mergeBarcodes(formattedTags);
    let expected = [
      {
        barcode: 'ITEM000001',
        amount: 1
      },
      {
        barcode: 'ITEM000003',
        amount: 2.5
      },
      {
        barcode: 'ITEM000005',
        amount: 3
      }
    ];

    expect(actual).toEqual(expected);
  });

});

describe('calculateSubTotalCartItems', () => {

  it('should get discountedSubTotalCartItems', ()=> {
    let expected = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 5,
        originSubTotal: 15.00,
        discountedSubTotal: 12.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        amount: 2.5,
        originSubTotal: 37.50,
        discountedSubTotal: 37.50
      }
      ,
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        amount: 3,
        originSubTotal: 13.50,
        discountedSubTotal: 9.00

      }
    ];


    let promotingInfo = [
      {
        barcode: 'ITEM000001',
        type: 'BUY_TWO_GET_ONE_FREE'
      },
      {
        barcode: 'ITEM000005',
        type: 'BUY_TWO_GET_ONE_FREE'
      }
    ];
    let originSubTotalCartItems = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 5,
        originSubTotal: 15.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        amount: 2.5,
        originSubTotal: 37.50
      }
      ,
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        amount: 3,
        originSubTotal: 13.50
      }
    ];
    let actual = calculateDiscountedSubTotalCartItems(promotingInfo, originSubTotalCartItems);
    // console.log(JSON.stringify(actual, null, 2));
    expect(actual).toEqual(expected);
  });

});

describe('calculateOriginSubTotalCartItems', () => {
  it('should get originSubTotalCartItems', ()=> {
    let expected = [
      {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 5,
        originSubTotal: 15.00
      },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00,
        amount: 2.5,
        originSubTotal: 37.50
      }
      ,
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50,
        amount: 3,
        originSubTotal: 13.50
      }
    ];

    let barcodeAmountList = [
      {
        barcode: 'ITEM000001',
        amount: 5
      },
      {
        barcode: 'ITEM000003',
        amount: 2.5
      },
      {
        barcode: 'ITEM000005',
        amount: 3
      }

    ];

    let actual = calculateOriginSubTotalCartItems(barcodeAmountList, loadAllItems());
    expect(actual).toEqual(expected);
  });

});

describe('calculateOriginTotalPrice', () => {
  it('should get origin total price', function () {

    let discountedSubTotalCartItems = [
      {
        "barcode": "ITEM000001",
        "name": "雪碧",
        "unit": "瓶",
        "price": 3,
        "amount": 5,
        "originSubTotal": 15,
        "discountedSubTotal": 12
      },
      {
        "barcode": "ITEM000003",
        "name": "荔枝",
        "unit": "斤",
        "price": 15,
        "amount": 2.5,
        "originSubTotal": 37.5,
        "discountedSubTotal": 37.5
      },
      {
        "barcode": "ITEM000005",
        "name": "方便面",
        "unit": "袋",
        "price": 4.5,
        "amount": 3,
        "originSubTotal": 13.5,
        "discountedSubTotal": 9
      }
    ];
    let actual = calculateOriginTotalPrice(discountedSubTotalCartItems);
    let expected = 66;

    expect(actual).toEqual(expected);

  });

});

describe('calculateDiscountPrice', () => {
  it('should get discount', function () {
    let discountedSubTotalCartItems = [
      {
        "barcode": "ITEM000001",
        "name": "雪碧",
        "unit": "瓶",
        "price": 3,
        "amount": 5,
        "originSubTotal": 15,
        "discountedSubTotal": 12
      },
      {
        "barcode": "ITEM000003",
        "name": "荔枝",
        "unit": "斤",
        "price": 15,
        "amount": 2.5,
        "originSubTotal": 37.5,
        "discountedSubTotal": 37.5
      },
      {
        "barcode": "ITEM000005",
        "name": "方便面",
        "unit": "袋",
        "price": 4.5,
        "amount": 3,
        "originSubTotal": 13.5,
        "discountedSubTotal": 9
      }
    ];

    let discount = calculateDiscount(discountedSubTotalCartItems);

    let expected = 7.5;

    expect(discount).toEqual(expected);
  });

});

describe('pos', () => {

  it('should print correct receipt text', function () {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');


    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);

  })

});
