import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Number,
        default: null
    },
    imageUrl: {
        type: String,
        default: ""
    }
}, {timestamps: true});
const Item = mongoose.model("Item", ItemSchema);
export default Item;