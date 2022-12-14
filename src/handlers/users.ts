import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/users'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

const store = new UserStore()

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index()
    res.json(users)
    return
    }catch(err) {
      res.status(400)
      res.json(err)  
      return  
    }
}

const show = async (req: Request, res: Response) => {
   try {
    const user = await store.show(req.params.id)
    res.json(user)
    return
    }catch(err) {
      res.status(400)
      res.json(err)  
      return  
    }
}

const create = async (req: Request, res: Response) => {
    try {
      
        const user: User = {
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password : req.body.password
        }

        const newUser = await store.create(user)
        var token = jwt.sign({user:newUser},process.env.TOKEN_SECRET as string)

        res.json(token)
        return
    } catch(err) {
        res.status(400)
        res.json(err)
        return
    }
}

const authenticate = async (req: Request, res: Response) => { 
  try{
      const user = await store.authenticate(req.body.username,req.body.password)
      var token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as Secret);
      res.json(token)
      return
  }catch(err){
    res.status(400)
    res.json(err)
    return
  }
}
const destroy = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization
    const token = authorizationHeader?.split(' ')[1]
    jwt.verify(token as string, process.env.TOKEN_SECRET as Secret) as JwtPayload
} catch(err) {
    res.status(401)
    res.json(err)
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

const update = async (req: Request, res: Response) => {
  const user: User = {
      id: parseInt(req.body.id),
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname
  }
  //////console.log("updated user ",user)
  try {
      const authorizationHeader = req.headers.authorization
      const token = authorizationHeader?.split(' ')[1]
      const decoded = jwt.verify(token as string, process.env.TOKEN_SECRET as Secret) as JwtPayload

      if(decoded.user.id !== user.id) {
        throw new Error('User id does not match!')
      }

  } catch(err) {
      res.status(401)
      res.json(err)
      return
  }
  try {
      const updated = await store.update(user)
      const newToken = jwt.sign({user:updated},process.env.TOKEN_SECRET as string)

      res.json({...updated,token:newToken})
      return
  } catch(err) {
      res.status(400)
      res.json(err as string+ user)
      return
  }
}
const UserRoutes = (app: express.Application) => {
  app.get('/users', index)
  app.get('/users/:id', show)
  app.post('/users', create)
  app.post('/users/auth',authenticate)
  app.delete('/users', destroy)
  app.put('/users/update',update)
}

export default UserRoutes