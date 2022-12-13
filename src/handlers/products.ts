import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/products'
import jwt, { Secret }  from 'jsonwebtoken'

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
  const products = await store.index()
  res.json(products)
}

const show = async (req: Request, res: Response) => {
   const product = await store.show(req.params.id)
   res.json(product)
}

const create = async (req: Request, res: Response) => {
    try {
      const authorizationHeader = req.headers.authorization
      const token = authorizationHeader?.split(' ')[1]
      jwt.verify(token as string, process.env.TOKEN_SECRET as Secret)
  } catch(err) {
      res.status(401)
      res.json('Access denied, invalid token')
      return
  }  
  try {
        const product: Product = {
          name: req.body.name, 
          price: req.body.price,
          category: req.body.category
        }

        const newProduct = await store.create(product)
        res.json(newProduct)
    } catch(err) {
        res.status(400)
        res.json(err)
    }
}

const update = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization
    const token = authorizationHeader?.split(' ')[1]
    jwt.verify(token as string, process.env.TOKEN_SECRET as Secret)
} catch(err) {
    res.status(401)
    res.json('Access denied, invalid token')
    return
}  
try {
      const product: Product = {
        id :req.body.id,
        name: req.body.name, 
        price: req.body.price,
        category: req.body.category
      }

      const updatedProduct = await store.update(product)
      res.json(updatedProduct)
  } catch(err) {
      res.status(400)
      res.json(err)
  }
}

const destroy = async (req: Request, res: Response) => {
    try {
      const authorizationHeader = req.headers.authorization
      const token = authorizationHeader?.split(' ')[1]
      jwt.verify(token as string, process.env.TOKEN_SECRET as Secret)
  } catch(err) {
      res.status(401)
      res.json('Access denied, invalid token')
      return
  }  
  const deleted = await store.delete(req.body.id)
  res.json(deleted)
}

const productRoutes = (app: express.Application) => {
  app.get('/products', index)
  app.get('/products/:id', show)
  app.post('/products', create)
  app.delete('/products', destroy)
  app.put('/products/update', update)
}

export default productRoutes