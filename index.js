import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { MongoClient, ObjectId } from "mongodb";


const app = express();
const port = process.env.PORT ||5000

//*********************   MongoDB
const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const DB = await connectToMongoDB()
const dataBase = DB.db('hireloopdb')
const users = dataBase.collection('user')
const jobs = dataBase.collection('jobs')

//*******************    Middleware
app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get('/users',async (req,res)=>{
  const cursor = users.find({});
  const result = await cursor.toArray();
  res.send(result)
})
// ************************ Jobs related api
app.post('/jobs',async(req,res)=>{
  const job = req.body
  const result = await jobs.insertOne(job);
  res.send(result);
})
app.get('/jobs',async(req,res)=>{
  const cursor = jobs.find({})
  const result = await cursor.toArray();
  res.send(result);
})
app.delete('/jobs/:id',async (req,res)=>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await jobs.deleteOne(query);
  res.send(result);
})











app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


