import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    buyPrice: {
        type: Number,
        required: true,
    },
    buyDate: {
        type: Number,
        required: true,
    },
    soldPrice: {
        type: Number,
        default: null,
    },
    soldDate: {
        type: Number,
        default: null,
    },
}, {timestamps: true});
const Item = mongoose.model("Item", ItemSchema);
export default Item;