import Item from '../models/item.model.js';
import { errorHandler } from '../utils/error.js';

const itemRegex = /^[a-zA-Z0-9! |★壱]+$/
const priceRegex = /^-?\d+(\.\d{1,2})?$/

export const createItem = async (req, res, next) => {
    const {item, priceBuy, dateBuy, dateSold, priceSold} = req.body;
    const trimItem = item == undefined? '': item.trim();
    let finalSoldDate = dateSold || null;
    let finalSoldPrice = priceSold || null;
    if (!itemRegex.test(trimItem)) return next(errorHandler(400,"Please enter a valid item name. It can contain letters, numbers, exclamation marks, spaces, pipe characters (|), or special symbols like ★ and 壱."));
    if (!priceRegex.test(priceBuy) || !priceRegex.test(dateBuy)) return next(errorHandler(400,"Please enter a valid price or date. Price should be a number (optionally with up to two decimal places)."));
    if (finalSoldDate && !priceRegex.test(finalSoldDate)) {
        return next(errorHandler(400, "Sold date must be a valid format."));
    }
    if (finalSoldPrice && !priceRegex.test(finalSoldPrice)) {
        return next(errorHandler(400, "Sold price must be a valid number with up to two decimal places."));
    }
    if (finalSoldDate && !finalSoldPrice) {
        finalSoldPrice = 0;
    }
    if (finalSoldPrice && !finalSoldDate) {
        finalSoldDate = Math.floor(Date.now() / 1000);
    }
    if (finalSoldDate && Math.abs(parseInt(finalSoldDate)) < Math.abs(parseInt(dateBuy))) {
        return next(errorHandler(400, "Sold date cannot be before buy date."));
    }
    try {
    const item = new Item({
        itemName: trimItem,
        buyPrice: priceBuy,
        buyDate: dateBuy,
        soldDate: finalSoldDate,
        soldPrice: finalSoldPrice
    });
    await item.save();
    res
    .status(201)
    .json(item);
    } catch (error) {
        next(error);
    }
}