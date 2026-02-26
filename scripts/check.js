const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { Contact } = require('./models/Contact');
const { List } = require('./models/List');

async function checkData() {
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if Contact model exists, we might need to load from app dir
    try {
        const User = require('./models/User').default || require('./models/User');
        const Contact = require('./models/Contact').default || require('./models/Contact');
        const List = require('./models/List').default || require('./models/List');

        const lists = await List.find({});
        console.log('Lists:', lists);

        const contacts = await Contact.find({});
        console.log('Contacts:', contacts);

        if (lists.length > 0) {
            const listId = lists[0]._id;
            const contactsInList = await Contact.find({ listIds: listId });
            console.log(`Contacts in list ${lists[0].name}:`, contactsInList);
        }
    } catch (e) {
        console.error(e);
    }

    mongoose.connection.close();
}

checkData();
