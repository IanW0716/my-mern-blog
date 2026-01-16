const mongoose = require('mongoose');

const {Schema, model} = mongoose;
const PostSchema = new Schema({
    title: String,
    summary: String,
    img: String,
    content: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    likes:[{type: Schema.Types.ObjectId, ref: 'User'}],
},{
    timestamps: true,
})

const PostModel = model("Post", PostSchema);
module.exports = PostModel;