import express from "express";
import cors from 'cors'
import graphRoute from './routes/graph.js'
const app = express();

app.use(cors());

app.get('/', (req, res) => res.send('Hello world!'));
app.use('/api/graph', graphRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));