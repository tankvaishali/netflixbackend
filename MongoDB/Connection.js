import mongoose from 'mongoose';

const MongoDb = () => {
    mongoose.connect('mongodb+srv://vaishalitank28603:vaishalitank312@cluster0.qzxy1.mongodb.net/netflix')
        .then(() => console.log('Connected!'));
}

export default MongoDb;