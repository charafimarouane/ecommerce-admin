const { Schema, models, model } = require("mongoose");

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postalcode: String,
    adress: String,
    paid: Boolean,
},{
    timestamps:true,
})

export const Order = models?.Order || model('Order', OrderSchema)