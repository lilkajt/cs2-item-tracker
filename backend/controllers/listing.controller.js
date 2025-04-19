import Item from '../models/item.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

const itemRegex = /^[a-zA-Z0-9! |★壱()-™]+$/
const priceRegex = /^-?\d+(\.\d{1,2})?$/
const itemUrlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

const validatePriceFormat = (price, fieldName, next) => {
    if (price && !priceRegex.test(price)) {
        return next(errorHandler(400, `${fieldName} must be a valid number, optionally with up to two decimal places.`));
    }
    return true;
};

const validateDateFormat = (date, fieldName, next) => {
    if (date && !priceRegex.test(date)) {
        return next(errorHandler(400, `${fieldName} must be a valid numeric timestamp.`));
    }
    return true;
};

const validateItemId = (itemId, next) => {
    if (!itemId) return next(errorHandler(400, "Oops! We couldn't process your request. Item ID is missing."));
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return next(errorHandler(400, "That doesn't look like a valid item ID. Please double-check and try again."));
    }
    return true;
};

export const createItem = async (req, res, next) => {
    const {itemName, buyPrice, buyDate, soldDate, soldPrice, imageUrl} = req.body;
    const trimImageUrl = imageUrl == undefined? '': imageUrl.trim();
    let finalSoldDate = soldDate;
    let finalSoldPrice = soldPrice;
    if (!validatePriceFormat(buyPrice, "Buy price", next)) return;
    if (!validatePriceFormat(soldPrice, "Sold price", next)) return;
    if (!validateDateFormat(buyDate, "Buy date", next)) return;
    if (!validateDateFormat(soldDate, "Sold date", next)) return;
    if (finalSoldDate && !finalSoldPrice) {
        finalSoldPrice = 0;
    }
    if (finalSoldPrice && !finalSoldDate) {
        finalSoldDate = Math.floor(Date.now() / 1000);
    }
    if (finalSoldDate && Math.abs(parseInt(finalSoldDate)) < Math.abs(parseInt(buyDate))) {
        return next(errorHandler(400, "The sold date can't be earlier than the buy date. Please double-check your dates."));
    }
    if (!itemRegex.test(itemName)) return next(errorHandler(400,"Item name can only include letters, numbers, !, |, ★, 壱, (), -, ™ and spaces. Please try again."));
    if (trimImageUrl !== ''){
        if (!itemUrlRegex.test(trimImageUrl)) return next(errorHandler(400, "Item image url must be valid syntax."));
    }
    try {
    const item = new Item({
        userId: req.user.id,
        itemName: itemName,
        buyPrice: buyPrice,
        buyDate: buyDate,
        soldDate: finalSoldDate,
        soldPrice: finalSoldPrice,
        imageUrl: trimImageUrl
    });
    await item.save();
    const {userId, isDeleted, deletedAt, ...rest} = item._doc;
    res
    .status(201)
    .json({success: true, item: rest});
    } catch (error) {
        next(error);
    }
};

export const getItems = async (req, res, next) => {
    if (!req.user.id) return next(errorHandler(400, "Something went wrong verifying your account. Please log in again."));
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        if (page < 1 || limit < 1 || limit > 50){
            return next(errorHandler(400, "Invalid pagination parameters. Page must be ≥1 and limit between 1-50."));
        }
        const skip = (page - 1) * limit;
        const query = {
            userId: req.user.id,
            isDeleted: false
        };
        const totalItems = await Item.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const items = await Item.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ buyDate: -1});

        const sanitizedItems = items.map(item => {
            const { isDeleted, deletedAt, userId, ...itemData } = item._doc;
            return itemData;
        });
        res
        .status(200)
        .json({
            success: true,
            items: sanitizedItems,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getItem = async (req, res, next) => {
    const itemId = req.params.id;
    if (!validateItemId(itemId, next)) return;
    try {
        const item = await Item.findOne(
            {_id: itemId, userId: req.user.id, isDeleted: false},
            { isDeleted: 0, deletedAt: 0, userId: 0}
        );
        if (!item) return next(errorHandler(404, "Poof! That item’s gone — or maybe it was never yours to begin with."));
        res
        .status(200)
        .json({ success: true, item: item});
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req, res, next) => {
    const itemId = req.params.id;
    if (!validateItemId(itemId, next)) return;
    try {
        const existingItem = await Item.findOne(
            {_id: itemId, userId: req.user.id, isDeleted: false},
            {buyDate: 1, soldDate: 1}
        );
        if (!existingItem) return next(errorHandler(404, "Poof! That item’s gone — or maybe it was never yours to begin with."));
        const updateData = {};
        const { itemName, buyPrice, buyDate, soldDate, soldPrice, imageUrl} = req.body;

        if (itemName !== undefined) {
            const trimItem = itemName.trim();
            if (!itemRegex.test(trimItem)) {
                return next(errorHandler(400, "Item name must only include allowed characters (letters, numbers, !, |, etc)."));
            }
            updateData.itemName = trimItem;
        }
        if ( imageUrl !== undefined) {
            const trimImage = imageUrl.trim();
            if (!itemUrlRegex.test(trimImage)) {
                return next(errorHandler(400, "Item image url must be valid syntax."));
            }
            updateData.imageUrl = trimImage;
        }
        
        if (buyPrice !== undefined) {
            if (!validatePriceFormat(buyPrice, "Buy price", next)) return;
            updateData.buyPrice = buyPrice;
        }
        
        if (buyDate !== undefined) {
            if (!validateDateFormat(buyDate, "Buy date", next)) return;
            updateData.buyDate = buyDate;
        }
        
        let finalSoldDate = soldDate;
        let finalSoldPrice = soldPrice;
        
        if (finalSoldDate !== undefined) {
            if (!validateDateFormat(finalSoldDate, "Sold date", next)) return;
            updateData.soldDate = finalSoldDate;
        }
        
        if (finalSoldPrice !== undefined) {
            if (!validatePriceFormat(finalSoldPrice, "Sold price", next)) return;
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
    if (!validateItemId(itemId, next)) return;
    try {
        const updatedItem = await Item.findOneAndUpdate(
            {_id: itemId, userId: req.user.id, isDeleted: false},
            {isDeleted: true, deletedAt: Math.floor(Date.now() / 1000)},
            { new: true}
        );
        if (!updatedItem) return next(errorHandler(404, "Poof! That item’s gone — or maybe it was never yours to begin with."));
        res.status(200).json({
            success: true,
            message: "Item deleted!" 
        });
    } catch (error) {
        next(error);
    }
};