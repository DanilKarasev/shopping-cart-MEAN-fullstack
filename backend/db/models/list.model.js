const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
});

module.exports = mongoose.model.List || mongoose.model("List", ListSchema);
