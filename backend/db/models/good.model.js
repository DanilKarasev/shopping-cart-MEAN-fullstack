const mongoose = require("mongoose");

const GoodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  _listId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  important: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model.Good || mongoose.model("Good", GoodSchema);
