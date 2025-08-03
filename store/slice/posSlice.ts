import { createSlice } from "@reduxjs/toolkit";
import {
  startOfToday,
  endOfToday,
  format,
  formatDistance,
  isWithinInterval,
  parseISO
} from "date-fns";
/**
 * TOTAL CALCULATIONS
 */
const totalCalculation = (state) => {
  const cash = parseInt(state?.paidAmount?.cash);
  const usePointAmount = parseInt(state?.paidAmount?.point);
  const mfs = parseInt(state?.paidAmount?.mfs?.amount);
  const card = parseInt(state?.paidAmount?.card?.amount);
  const promo_discount = parseInt(state?.promo_discount);
  const discount = parseInt(state?.discount);
  const grossTotal = parseInt(state.grossTotal);

  const totalRecivedAmount = cash + card + mfs + usePointAmount;

  const changeAmount =
    parseFloat(totalRecivedAmount) + parseFloat(promo_discount) + parseFloat(discount) - parseFloat(grossTotal);

  // console.log("TOTAL CALCULATIONS Tigger from slice",totalRecivedAmount,changeAmount)

  state.totalReceived = totalRecivedAmount;
  // state.grossTotal = grossTotal - discount
  state.changeAmount = changeAmount - discount;
};

const posFinalizer = (state) => {
  // console.log(cart, type);
  let totalItem = 0;
  let total = 0;
  let vatAmount = 0;
  let promoPrice = 0;
  let promoVat = 0;

  let returnTotalItem = 0;
  let returnTotal = 0;
  let returnVatAmount = 0;
  let returnPromoPrice = 0;
  let returnPromoVat = 0;

  // Products
  state?.products?.length > 0 &&
    state?.products?.map((item) => {
      // TODO:: update qty system (totalItem) by unit
      totalItem = totalItem + parseInt(isLoose(item.article_code, item.qty));
      total = total + itemTotal(item.qty, item.mrp);
      const promo = item?.promo ? item.promo : {};
      promoPrice = promoPrice + itemPromo(item.qty, promo, item.mrp);
      // if(item?.promo){
      // vatAmount = vatAmount + itemVat(item.vat, item.qty, (item.mrp-promoPrice)); //vat = how much like 5% ||
      // }else{
      vatAmount = vatAmount + itemVat(item.vat, item.qty, item.mrp); //vat = how much like 5% ||
      promoVat = isVatable(item?.article_code) ? 0 : (promoPrice * 5) / 100;
    });

  // return PRODUCT
  state?.returnProducts?.length > 0 &&
    state?.returnProducts?.map((item) => {
      returnTotalItem =
        returnTotalItem + parseInt(isLoose(item.article_code, item.qty));
      returnTotal = returnTotal + itemTotal(item.qty, item.mrp);
      returnVatAmount = returnVatAmount + itemVat(item.vat, item.qty, item.mrp); //vat = how much like 5% ||
    });

  // console.log("vat:", vatAmount, promoVat, (vatAmount-promoVat))
  if (promoVat > 0) {
    vatAmount = vatAmount - promoVat;
  }
  const grossTotal = parseFloat(total)  - parseFloat(returnTotal);
  const grossTotalRound = Math.round(grossTotal);
  const newPoint = Math.floor(Math.round(grossTotalRound) / 100);

  // console.log(
  //   totalItem,
  //   total,
  //   vatAmount,
  //   grossTotal,
  //   grossTotalRound,
  //   newPoint
  // );
  state.totalItem = totalItem;
  state.total = total;
  state.vatAmount = vatAmount;
  state.grossTotal = grossTotal - state.discount;
  state.grossTotalRound = grossTotalRound - state.discount;
  state.newPoint = newPoint;
  state.promoPrice = promoPrice;

  state.returnCal.totalItem = returnTotalItem;
  state.returnCal.total = returnTotal;
  state.returnCal.grossTotal = returnTotal + returnVatAmount;
  state.returnCal.vat = returnVatAmount;
  state.returnCal.grossTotalRound = Math.floor(
    Math.round(returnTotal + returnVatAmount)
  );
  state.returnCal.point = Math.floor(Math.round(returnTotal)) / 100;

  if (state.due) {
    state.paidAmount.cash = grossTotalRound - state.discount;
  }

  // state.newPoint=newPoint;
  // state.promoPrice=promoPrice;
};

const isLoose = (id, qty) => {
  var decimals = qty - Math.floor(qty);
  const looseCat = [59, 54, 61];
  const cat = parseInt(id?.substring(0, 2));
  // console.log(cat, looseCat.includes(cat))
  if (looseCat.includes(cat) && decimals > 0) {
    return 1;
  } else {
    return qty;
  }
};

const isVatable = (id) => {
  const looseCat = [59, 54, 61];
  const cat = parseInt(id?.substring(0, 2));
  // console.log(cat, looseCat.includes(cat))
  if (looseCat.includes(cat)) {
    return true;
  } else {
    return false;
  }
};

const itemPromo = (qty, promo, mrp) => {
  let promoPrice = 0;
  if (promo?.promo_type) {
    promoPrice =
      parseFloat(qty) *
      ((parseFloat(promo?.promo_price ? promo?.promo_price : 0) / 100) * mrp);
  } else {
    promoPrice =
      parseFloat(qty) * parseFloat(promo?.promo_price ? promo?.promo_price : 0);
  }

  return parseFloat(promoPrice);
};

const itemTotal = (qty, price) => {
  // console.log("promo list", promo)
  const itemTotal = parseFloat(qty) * parseFloat(price);
  return parseFloat(itemTotal);
};

const itemVat = (vat, qty, price) => {
  const itemVatTotal = itemTotal(qty, price) * (parseFloat(vat) / 100);
  return parseFloat(itemVatTotal);
};

const itemVatTotal = (vat, qty, price) => {
  const itemTotal = parseFloat(qty) * parseFloat(price);
  const itemVat = parseFloat(qty) * parseFloat(price) * (parseFloat(vat) / 100);
  const itemVatTotal = parseFloat(itemTotal + itemVat);
  return itemVatTotal;
};

const toDecimal = (float) => {
  if (float) {
    return float.toFixed(2);
  }
  return float;
};

const user = {
  warehouse: "",
  aamarId:"",
  id:""
}


// const {id, warehouse} = user;
// console.log("user from  posSlice:", user,id,warehouse);

const intialState = {
  invoiceId: "0171000000",
  source: "app",
  warehouse: user?.warehouse,
  aamarId: user?.aamarId,
  products: [],
  returnProducts: [],
  returnCal: {
    totalItem: 0,
    total: 0,
    vat: 0,
    grossTotal: 0,
    grossTotalRound: 0,
    point: 0,
  },
  returnInvoice: null,
  paidAmount: {
    cash: 0,
    mfs: {
      name: "bkash",
      amount: 0,
    },
    card: {
      name: "visa",
      amount: 0,
    },
    point: 0,
  },
  changeAmount: 0,
  totalReceived: 0,
  grossTotal: 0,
  grossTotalRound: 0,
  totalItem: 0,
  total: 0,
  vat: 0,
  point: {
    old: 0,
    new: 0,
  },
  todayPoint: 0,
  due: false,
  billType: "paid",
  discount: 0,
  billerId: user?.id,
  group: null,
  customerId: null,
  customerPhone: "0171000000",
  customerName: "Walkway Customer",
  updateUser: user?.id,
  promo_discount: 0,
  status: "complete",
};

export const posSlice = createSlice({
  name: "pos",
  initialState: intialState,

  reducers: {
    //new
    selcetBillerInfo: (state, action) => {
      return {
        ...state,
        billerId: action.payload.id,
        updateUser: action.payload.id,
        warehouse: action.payload.warehouse,
        aamarId: action.payload.aamarId,
      };
    },
    addProductToCart: (state, action) => {
      const product = action.payload;
      let products = [];

      // console.log(product,state.products)

      const matched = state?.products?.find(pro => pro?.id === product._id);
      const rest = state?.products?.filter(pro => pro?.id !== product._id); 

      const newProduct = {
        id: product?._id,
        name: product?.name,
        photo: product?.photo,
        article_code: product?.article_code,
        ean: product?.ean,
        stock: product?.stock,
        mrp: product?.mrp,
        qty: matched ? matched?.qty + (product?.qty ? product?.qty : 1) : (product?.qty ? product?.qty : 1), // Update quantity if exists
        tp: product?.tp,
        vat: product?.vat || 0,
        aamarId: state.aamarId,
        warehouse: state.warehouse,
        unit: product?.unit,
        total: (matched ? matched?.qty + 1 : 1) * product?.mrp,
        promo: {
          promo_price: 0,
          promo_type: false
        },
        supplier: 0,
        order: matched ? matched.order : state.products.length + 1 // Preserve order for existing product
      };

      // Ensure updated product is added back to the array
      products = [...rest, newProduct];

      return {
        ...state,
        products: products
      };
    },
    removeQuantityReducer: (state, actions) => {
      const products = state.products;
      const article_code = actions.payload;

      const selectedItem = products.find(
        (p) => p.article_code === article_code
      );
      const restItem = products.filter((p) => p.article_code !== article_code);

      if (selectedItem) {
      }
      selectedItem.qty = selectedItem.qty > 0 ? selectedItem.qty - 1 : 0;
      selectedItem.total = selectedItem.qty * selectedItem.mrp;

      const newCart = [...restItem, selectedItem];

      // console.log(newCart);
    },
    addQuantityReducer: (state, actions) => {
      // console.log(actions.payload)
      const products = state.products;
      const article_code = actions.payload;
      // if (products) {
      const selectedItem = products?.find(
        (p) => p.article_code === article_code
      );
      const restItem = products.filter((p) => p.article_code !== article_code);

      selectedItem.qty = selectedItem.qty >= 0 ? selectedItem.qty + 1 : 0;
      selectedItem.total = selectedItem.qty * selectedItem.mrp;
      const newCart = [...restItem, selectedItem];

      // console.log(newCart)
    },
    removeItemFormCartReducer: (state, actions) => {
      // console.log("SLICE ARTICLE CODE",actions.payload)
      const products = state?.products;
      const article_code = actions?.payload;
      // if (products) {
      // const selectedItem = products.find((p) => p.article_code === article_code);
      const restItem = products.filter((p) => p?.article_code !== article_code);

      // selectedItem.qty = selectedItem.qty >= 0 ? selectedItem.qty + 1 : 0;
      // const newCart = [...restItem, selectedItem];

      // console.log(newCart)

      return {
        ...state,
        products: restItem
      };
    },
    removeItemFormReturnCartReducer: (state, actions) => {
      // console.log("SLICE ARTICLE CODE",actions.payload)
      const products = state.returnProducts;
      const article_code = actions.payload;
      // if (products) {
      // const selectedItem = products.find((p) => p.article_code === article_code);
      const restItem = products.filter((p) => p?.article_code !== article_code);

      // selectedItem.qty = selectedItem.qty >= 0 ? selectedItem.qty + 1 : 0;
      // const newCart = [...restItem, selectedItem];

      // console.log(newCart)

      return {
        ...state,
        returnProducts: restItem
      };
    },
    posFinalizerReducer: (state) => {
      posFinalizer(state);
    },
    posCalculationReducer: (state) => {
      totalCalculation(state);
    },
    setIsBillOpen: (state, action) => {
      return {
        ...state,
        isBillOpen: action.payload,
      };
    },
    //end new
    selectInvoiceId: (state, action) => {
      return {
        ...state,
        invoiceId: action.payload,
      };
    },
    selcetUpdateUser: (state, action) => {
      return { ...state, updateUser: action.payload };
    },
    selcetBiller: (state, action) => {
      return {
        ...state,
        billerId: action.payload,
      };
    },
    selectWarehouse: (state, action) => {
      return {
        ...state,
        warehouse: action.payload,
      };
    },

    selcetCustomer: (state, action) => {
      // console.log("Add Customer", action.payload);
      // const newPoint = state.point.new + action.payload.point;
      return {
        ...state,
        customerId: action.payload.customerId,
        updateUser: action.payload.customerId,
        point: {
          old: action.payload.point,
          new: state.todayPoint + action.payload.point,
        },
        customerPhone: action.payload.phone,
        customerName: action.payload.name,
        group: action.payload.group ? action.payload.group : null,
      };
    },
    resetCustomer: (state, action) => {
      // console.log("Add Customer", action.payload);
      // const newPoint = state.point.new + action.payload.point;
      return {
        ...state,
        customerId: null,
        point: {
          old: 0,
          new: 0,
        },
        customerPhone: "0171000000",
        customerName: "Walkway Customer",
        group: null,
        due:false,
        billType: "paid",

      };
    },
    selectGroup: (state, action) => {
      return {
        ...state,
        group: action.payload.group,
      };
    },
    selcetProductsCart: (state, action) => {
      return {
        ...state,
        products: action.payload,
      };
    },
    saleFinalize: (state, action) => {
      const pointToday = Math.floor(action.payload.grossTotalRound / 100);
      const newPoint =
        Number(state.point.old) + pointToday - state.paidAmount.point;

      // console.log("action.payload", action.payload);
      return {
        ...state,
        totalItem: action.payload.totalItem,
        total: action.payload.total,
        vat: action.payload.vatAmount - action.payload.reVat,
        grossTotal:
          action.payload.grossTotal -
          action.payload.promo_discount -
          action.payload.discount -
          action.payload.reGrossTotalRound,
          grossTotalRound: Math.round(
            action.payload.grossTotalRound -
              action.payload.promo_discount -
              action.payload.discount -
              action.payload.reGrossTotalRound
          ),
        // discount: action.payload.discount,
        promo_discount: action.payload.promo_discount,

        changeAmount:
          state.totalReceived +
          action.payload.reTotal -
          action.payload.grossTotalRound,
        point: {
          ...state.point,
          new: newPoint - action.payload.rePoint,
        },
        todayPoint: pointToday,
        returnCal: {
          ...state.returnCal,
          totalItem: parseFloat(action.payload.reTotalItem),
          total: action.payload.reTotal,
          grossTotalRound: action.payload.reGrossTotalRound,
          grossTotal: action.payload.reGrossTotal,
          point: action.payload.rePoint,
          vat: action.payload.reVat,
        },
      };
    },
    salesPromoPrice: (state, action) => {
      return {
        ...state,
        promo_discount: action.payload,
      };
    },
    salesAmountRecived: (state, action) => {
      return {
        ...state,
        totalReceived: action.payload.totalRecivedAmount,
        changeAmount: action.payload.changeAmount - state.promo_discount,
      };
    },

    saleCash: (state, action) => {
      state.paidAmount.cash = action.payload;
      totalCalculation(state);
    },
    saleCardName: (state, action) => {
      return {
        ...state,
        paidAmount: {
          ...state.paidAmount,
          card: { ...state.paidAmount.card, name: action.payload }
        }
      };
    },
    saleCardAmount: (state, action) => {
      state.paidAmount.card.amount = action.payload;
      totalCalculation(state);
    },
    saleMfsName: (state, action) => {
      return {
        ...state,
        paidAmount: {
          ...state.paidAmount,
          mfs: { ...state.paidAmount.mfs, name: action.payload }
        }
      };
    },
    saleMfsAmount: (state, action) => {
      state.paidAmount.mfs.amount = action.payload;
      totalCalculation(state);
    },
    salePointAmount: (state, action) => {
      return {
        ...state,
        paidAmount: {
          ...state.paidAmount,
          point: action.payload,
        },
      };
    },
    saleNewPoint: (state, action) => {
      return {
        ...state,
        point: {
          ...state.point,
          new: action.payload,
        },
      };
    },
    saleDiscount: (state, action) => {
      return {
        ...state,
        discount: action.payload,
      };
    },
    saleReturnProducts: (state, action) => {
      return {
        ...state,
        returnProducts: action.payload,
      };
    },
    saleReturnInfo: (state, action) => {
      return {
        ...state,
        returnInvoice: action.payload.returnInvoice,
        customerId: action.payload.customerId,
        customerPhone: action.payload.customerPhone,
        customerName: action.payload.customerName,
        point: {
          ...state.point,
          old: action.payload.customerPoint,
        },
      };
    },

    // saleReturnQty: (state, action) => {
    //   let seletedItem = state.returnProducts.filter(
    //     (item) => item.article_code === action.payload.id
    //   );
    //   let restItem = state.returnProducts.filter(
    //     (item) => item.article_code !== action.payload.id
    //   );
    //   seletedItem = {
    //     ...seletedItem,
    //     qty: action.payload.qty,
    //   };
    //   restItem = { ...restItem, seletedItem };
    //   const returnItems = restItem.sort((a, b) => a.order - b.order);
    //   return {
    //     ...state,
    //     returnProducts: returnItems,
    //   };
    // },
    saleReset: () => intialState,
    setDue: (state, action) => {
      return {
        ...state,
        due: action.payload,
        billType: action.payload === true ? "due" : "paid",
      };
    },
  },
});

export const {
  selcetBiller,
  selcetCustomer,
  selcetProductsCart,
  saleFinalize,
  salesAmountRecived,
  saleCash,
  saleCardName,
  saleCardAmount,
  saleMfsName,
  saleMfsAmount,
  salePointAmount,
  saleDiscount,
  saleNewPoint,
  selectInvoiceId,
  saleReturnProducts,
  saleReturnInfo,
  // saleReturnQty,
  salesPromoPrice,
  setDue,
  selcetUpdateUser,
  selectGroup,
  selectWarehouse,
  //New 
  resetCustomer,
  setIsBillOpen,
  saleReset,
  addProductToCart,
  selcetBillerInfo,
  removeQuantityReducer,
  addQuantityReducer,
  removeItemFormCartReducer,
  removeItemFormReturnCartReducer,
  posFinalizerReducer,
  posCalculationReducer
} = posSlice.actions;

export const posReducer = posSlice.reducer;
