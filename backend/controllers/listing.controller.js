import Item from '../models/item.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

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
        userId: req.user.id,
        itemName: trimItem,
        buyPrice: priceBuy,
        buyDate: dateBuy,
        soldDate: finalSoldDate,
        soldPrice: finalSoldPrice
    });
    await item.save();
    res
    .status(201)
    .json({success: true, item});
    } catch (error) {
        next(error);
    }
};

export const getItems = async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) return next(errorHandler(400, "We couldn't verify your account. Please log in again and try."));
    try {
        const items = Item.find({
            $and: [
                { userId: userId},
                { isDeleted: false}
            ]
        });
        res
        .status(200)
        .json({success: true, items: items});
    } catch (error) {
        next(error);
    }
};

export const getItem = async (req, res, next) => {
    const itemId = req.params.id;
    const userId = req.user.id;
    if (!itemId) return next(errorHandler(400,"Oops! We couldn't process your request. Item ID is missing."));
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return next(errorHandler(400, "That doesn't look like a valid item ID. Please double-check and try again."));
    }
    try {
        const item = await Item.find({
            $and: [
                {_id: itemId},
                {isDeleted: false}
            ]
        });
        if (!item) return next(errorHandler(404, "We couldn't find the item."));
        if (item.userId.toString() !== userId) {
            return next(errorHandler(403, "Hold on! You can only view items that belong to you."));
        }
        res
        .status(200)
        .json({ success: true, item: item});
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req, res, next) => {
    const itemId = req.params.id;
    const userId = req.user.id;
    if (!itemId) return next(errorHandler(400,"Oops! We couldn't process your request. Item ID is missing."));
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return next(errorHandler(400, "That doesn't look like a valid item ID. Please double-check and try again."));
    }
    try {
        const existingItem = await Item.find({
            $and: [
                {_id: itemId},
                {isDeleted: false}
            ]
        });
        if (!existingItem) return next(errorHandler(404, "We couldn't find the item you're trying to update."));
        if (existingItem.userId.toString() !== userId) {
            return next(errorHandler(403, "Hold on! You can only update items that belong to you."));
        }
        const updateData = {};
        const {item: itemName, priceBuy, dateBuy, dateSold, priceSold} = req.body;

        if (itemName !== undefined) {
            const trimItem = itemName.trim();
            if (!itemRegex.test(trimItem)) {
                return next(errorHandler(400, "Please enter a valid item name."));
            }
            updateData.itemName = trimItem;
        }
        
        if (priceBuy !== undefined) {
            if (!priceRegex.test(priceBuy)) {
                return next(errorHandler(400, "Please enter a valid buy price."));
            }
            updateData.buyPrice = priceBuy;
        }
        
        if (dateBuy !== undefined) {
            if (!priceRegex.test(dateBuy)) {
                return next(errorHandler(400, "Please enter a valid buy date."));
            }
            updateData.buyDate = dateBuy;
        }
        
        let finalSoldDate = dateSold;
        let finalSoldPrice = priceSold;
        
        if (finalSoldDate !== undefined) {
            if (finalSoldDate && !priceRegex.test(finalSoldDate)) {
                return next(errorHandler(400, "Sold date must be a valid format."));
            }
            updateData.soldDate = finalSoldDate;
        }
        
        if (finalSoldPrice !== undefined) {
            if (finalSoldPrice && !priceRegex.test(finalSoldPrice)) {
                return next(errorHandler(400, "Sold price must be a valid number."));
            }
            updateData.soldPrice = finalSoldPrice;
        }
        
        const newSoldDate = updateData.soldDate !== undefined ? updateData.soldDate : existingItem.soldDate;
        const newBuyDate = updateData.buyDate !== undefined ? updateData.buyDate : existingItem.buyDate;
        
        if (newSoldDate && newBuyDate && 
            Math.abs(parseInt(newSoldDate)) < Math.abs(parseInt(newBuyDate))) {
            return next(errorHandler(400, "Sold date cannot be before buy date."));
        }
        
        const updatedItem = await Item.findByIdAndUpdate(
            itemId, 
            { $set: updateData },
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            item: updatedItem
        });
    } catch (error) {
        next(error);
    }
};

export const deleteItem = async (req, res, next) => {
    const itemId = req.params.id;
    if (!itemId) return next(errorHandler(400,"Oops! We couldn't process your request. Item ID is missing."));
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return next(errorHandler(400, "That doesn't look like a valid item ID. Please double-check and try again."));
    }
    try {
        const item = await Item.findById(itemId);
        if (!item || item.isDeleted == true) return next(errorHandler(404, "We couldn't find the item you're trying to delete. It may have already been removed."));
        if (item.userId.toString() !== req.user.id) {
            return next(errorHandler(403, "Hold on! You can only delete items that belong to you."));
        }
        item.isDeleted = true;
        item.deletedAt = Math.floor(Date.now() / 1000);
        await item.save();
        res.status(200).json({
            success: true,
            message: "The item was deleted successfully." 
        });
    } catch (error) {
        next(error);
    }
};