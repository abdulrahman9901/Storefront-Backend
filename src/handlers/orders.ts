import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/orders'
import jwt, { Secret } from 'jsonwebtoken'

const store = new OrderStore()

const index = async (req: Request, res: Response) => {
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
  const orders = await store.index()
  res.json(orders)
  return
  }catch(err) {
    res.status(400)
    res.json(err)  
    return  
  }
}

const show = async (req: Request, res: Response) => {
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
    const order = await store.show(req.params.id)
    res.json(order)
    return
    }catch(err) {
      res.status(400)
      res.json(err)
      return
    }
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
          user_id: req.body.user_id, 
          status :req.body.status, 
        }
        const neworder = await store.create(order)
        res.json(neworder)
        return
    } catch(err) {
        res.status(400)
        res.json(err)
        return
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
        user_id: req.body.user_id,
        status: req.body.status,
      }
      const updatedOrder = await store.update(order)
      res.json(updatedOrder)
      return
  } catch(err) {
      res.status(400)
      res.json(err)
      return
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
  try {
    const deleted = await store.delete(req.body.id)
    res.json(deleted)
    return
    }catch(err) {
      res.status(400)
      res.json(err)
      return
    }
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
  try {
    const Orders = await store.current(req.params.user_id)
    res.json(Orders)
    return
  } catch(err) {
     res.status(400)
    res.json(err)  
    return  
  }   
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