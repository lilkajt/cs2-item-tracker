import Item from '../models/item.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

const itemRegex = /^[a-zA-Z0-9! |★壱]+$/
const priceRegex = /^-?\d+(\.\d{1,2})?$/

export const createItem = async (req, res, next) => {
    const {item, buyPrice, buyDate, soldDate, soldPrice} = req.body;
    const trimItem = item == undefined? '': item.trim();
    let finalSoldDate = soldDate || null;
    let finalSoldPrice = soldPrice || null;
    if (!itemRegex.test(trimItem)) return next(errorHandler(400,"Item name can only include letters, numbers, !, |, ★, 壱, and spaces. Please try again."));
    if (!priceRegex.test(buyPrice) || !priceRegex.test(buyDate)) return next(errorHandler(400,"Buy price and date must be valid numbers. Prices can have up to two decimal places."));
    if (finalSoldDate && !priceRegex.test(finalSoldDate)) {
        return next(errorHandler(400, "The sold date must be a valid numeric timestamp."));
    }
    if (finalSoldPrice && !priceRegex.test(finalSoldPrice)) {
        return next(errorHandler(400, "The sold price must be a valid number, optionally with up to two decimal places."));
    }
    if (finalSoldDate && !finalSoldPrice) {
        finalSoldPrice = 0;
    }
    if (finalSoldPrice && !finalSoldDate) {
        finalSoldDate = Math.floor(Date.now() / 1000);
    }
    if (finalSoldDate && Math.abs(parseInt(finalSoldDate)) < Math.abs(parseInt(buyDate))) {
        return next(errorHandler(400, "The sold date can't be earlier than the buy date. Please double-check your dates."));
    }
    try {
    const item = new Item({
        userId: req.user.id,
        itemName: trimItem,
        buyPrice: buyPrice,
        buyDate: buyDate,
        soldDate: finalSoldDate,
        soldPrice: finalSoldPrice
    });
    await item.save();
    const {userId, isDeleted, deletedAt, ...rest} = item._doc;
    res
    .status(201)
    .json({success: true, item: rest});
    } catch (error) {
        if (error instanceof TypeError){
            return next(errorHandler(400, "Oops! Something about your input didn't look right. Please try again."));
        }
        next(error);
    }
};

export const getItems = async (req, res, next) => {
    if (!req.user.id) return next(errorHandler(400, "Something went wrong verifying your account. Please log in again."));
    try {
        const items = await Item.find({
            $and: [
                { userId: req.user.id},
                { isDeleted: false}
            ]
        });
        const sanitizedItems = items.map(item => {
            const { isDeleted, deletedAt, userId, ...itemData } = item._doc;
            return itemData;
        });
        res
        .status(200)
        .json({success: true, items: sanitizedItems});
    } catch (error) {
        next(error);
    }
};

export const getItem = async (req, res, next) => {
    const itemId = req.params.id;
    if (!itemId) return next(errorHandler(400,"Oops! We couldn't process your request. Item ID is missing."));
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return next(errorHandler(400, "That doesn't look like a valid item ID. Please double-check and try again."));
    }
    try {
        const item = await Item.findOne({
            $and: [
                {_id: itemId},
                {isDeleted: false}
            ]
        });
        if (!item) return next(errorHandler(404, "We couldn’t find the item you’re looking for. It may have been removed."));
        if (item.userId.toString() !== req.user.id) {
            return next(errorHandler(403, "Hold on! You can only view items that belong to you."));
        }
        const { isDeleted, deletedAt, userId, ...rest} = item._doc;
        res
        .status(200)
        .json({ success: true, item: rest});
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req, res, next) => {
    const itemId = req.params.id;
    if (!itemId) return next(errorHandler(400,"Oops! We couldn't process your request. Item ID is missing."));
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return next(errorHandler(400, "That doesn't look like a valid item ID. Please double-check and try again."));
    }
    try {
        const existingItem = await Item.findOne({
            $and: [
                {_id: itemId},
                {isDeleted: false}
            ]
        });
        if (!existingItem) return next(errorHandler(404, "We couldn't find that item. It might have been deleted or doesn’t exist."));
        if (existingItem.userId.toString() !== req.user.id) {
            return next(errorHandler(403, "Hold on! You can only update items that belong to you."));
        }
        const updateData = {};
        const { itemName, buyPrice, buyDate, soldDate, soldPrice} = req.body;

        if (itemName !== undefined) {
            const trimItem = itemName.trim();
            if (!itemRegex.test(trimItem)) {
                return next(errorHandler(400, "Item name must only include allowed characters (letters, numbers, !, |, etc)."));
            }
            updateData.itemName = trimItem;
        }
        
        if (buyPrice !== undefined) {
            if (!priceRegex.test(buyPrice)) {
                return next(errorHandler(400, "Buy price must be a valid number (up to two decimal places)."));
            }
            updateData.buyPrice = buyPrice;
        }
        
        if (buyDate !== undefined) {
            if (!priceRegex.test(buyDate)) {
                return next(errorHandler(400, "Buy date must be a valid numeric timestamp."));
            }
            updateData.buyDate = buyDate;
        }
        
        let finalSoldDate = soldDate;
        let finalSoldPrice = soldPrice;
        
        if (finalSoldDate !== undefined) {
            if (finalSoldDate && !priceRegex.test(finalSoldDate)) {
                return next(errorHandler(400, "Please enter a valid sold date (numeric timestamp)."));
            }
            updateData.soldDate = finalSoldDate;
        }
        
        if (finalSoldPrice !== undefined) {
            if (finalSoldPrice && !priceRegex.test(finalSoldPrice)) {
                return next(errorHandler(400, "Sold price must be a valid number, optionally with decimals."));
            }
            updateData.soldPrice = finalSoldPrice;
        }
        
        const newSoldDate = updateData.soldDate !== undefined ? updateData.soldDate : existingItem.soldDate;
        const newBuyDate = updateData.buyDate !== undefined ? updateData.buyDate : existingItem.buyDate;
        
        if (newSoldDate && newBuyDate && 
            Math.abs(parseInt(newSoldDate)) < Math.abs(parseInt(newBuyDate))) {
            return next(errorHandler(400, "Sold date must be after the buy date. Please check your dates."));
        }

        const updatedItem = await Item.findByIdAndUpdate(
            itemId, 
            { $set: updateData },
            { new: true }
        );
        const {deletedAt, isDeleted, userId, ...rest} = updatedItem._doc;
        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            item: rest
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
        if (!item || item.isDeleted == true) return next(errorHandler(404, "We couldn’t find that item. It may have already been deleted."));
        if (item.userId.toString() !== req.user.id) {
            return next(errorHandler(403, "Hold on! You can only delete items that belong to you."));
        }
        item.isDeleted = true;
        item.deletedAt = Math.floor(Date.now() / 1000);
        await item.save();
        res.status(200).json({
            success: true,
            message: "Item deleted!" 
        });
    } catch (error) {
        next(error);
    }
};