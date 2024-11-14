const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const VocabSchema = new Schema(
    {
        english: {
            type: String,
            required: 'English word cannont be blank'
        },
        german: {
            type: String,
            required: 'Germen word cannot be blank'
        },
        russian: {
            type: String,
            required: 'Russian word cannont be blank'
        }
    },
    {collection: 'vocab'}
);

module.exports = mongoose.model('Vocab', VocabSchema);