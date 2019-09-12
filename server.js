const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');
const dataLayer = db('products.json', (item, items)=> {
  if(item.name === ''){
    return 'name is required';
  }
  if(items.map(item => item.name).includes(item.name)){
    return 'name must be unique';
  }
  if(item.price === 0){
    return 'price is required';
  }
});

app.use(express.json());

app.use((req, res, next)=> {
  console.log(req.url);
  next();
})

app.get('/', (req, res, next)=> {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/api/products', async(req, res, next)=> {
  try {
    const products = await dataLayer.findAll();
    res.send(products);
  }
  catch(ex){
    next(ex);
  }
})

app.delete('/api/products/:id', async(req, res, next)=> {
  try {
    console.log(req.params.id);
    await dataLayer.destroy(req.params.id);
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
})

app.post('/api/products', async(req, res, next)=> {
  try {
    res.send(await dataLayer.create(req.body))
  }
  catch(ex){
    next(ex);
  }
})

app.use((err, req, res, next) => {
  //console.log(err);
  res.send({message: err.message});
});

app.listen(3000, ()=> console.log('listening on port 3000'));
