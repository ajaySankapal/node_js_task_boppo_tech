import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.DATABASE_URI}`)
        console.log(`MongoDB connected !! DB HOST: ${connection.connection.host}`)
    } catch (error) {
        console.log('🔴 ERROR IN CONNECTING TO MONGODB')
    }
}


export default connectDb