const { Schema, models, model, default: mongoose } = require("mongoose");

const CategoriesSchema = new Schema({
    name: {type: String, required: true},
    parent:{type: mongoose.Types.ObjectId, ref:'Category'},
    properties: [{type : Object}]
});

export const Category = models?.Category || model('Category', CategoriesSchema)