import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/orders'
import jwt, { Secret } from 'jsonwebtoken'

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
  const orders = await store.index()
  res.json(orders)
}

const show = async (req: Request, res: Response) => {
   const order = await store.show(req.params.id)
   res.json(order)
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
        const order: Order = {
          product_id:req.body.product_id, 
          user_id: req.body.user_id, 
          quantity: req.body.quantity, 
          status :req.body.status, 
        }

        const neworder = await store.create(order)
        res.json(neworder)
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
      const order: Order = {
        id :req.body.id,
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        quantity: req.body.quantity,
        status: req.body.status,
      }

      const updatedOrder = await store.update(order)
      res.json(updatedOrder)
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
    return
}

const current = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization
    const token = authorizationHeader?.split(' ')[1]
    jwt.verify(token as string, process.env.TOKEN_SECRET as Secret)
} catch(err) {
    res.status(401)
    res.json('Access denied, invalid token')
    return
}  
    const Orders = await store.current(req.params.user_id)
    res.json(Orders)
    return
}
const orderRoutes = (app: express.Application) => {
  app.get('/orders', index)
  app.get('/orders/:id', show)
  app.post('/orders', create)
  app.put('/orders/update', update)
  app.delete('/orders', destroy)
  app.get('/orders/current/:user_id',current)
}

export default orderRoutes