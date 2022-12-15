// @ts-ignore
import Client from '../database'

export type Order = {
     id?: Number;
     user_id: Number, 
     status :string, 
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT * FROM Orders'
  
      const result = await conn.query(sql)
  
      conn.release()
  
      return result.rows 
    } catch (err) {
      throw new Error(`Could not get Orders. Error: ${err}`)
    }
  }

  async show(id: string): Promise<Order> {
    try {
    const sql = 'SELECT * FROM Orders WHERE id=($1)'
    // @ts-ignore
    const conn = await Client.connect()

    const result = await conn.query(sql, [id])

    conn.release()
        
    return result.rows[0]
    } catch (err) {
        throw new Error(`Could not find Order ${id}. Error: ${err}`)
    }
  }

  async create(O: Order): Promise<Order> {
      try {
    const sql = 'INSERT INTO Orders (status, user_id) VALUES($1, $2) RETURNING *'
    // @ts-ignore
    const conn = await Client.connect()

    const result = await conn
        .query(sql, [O.status, O.user_id])

    const Order = result.rows[0]

    conn.release()

    return Order
      } catch (err) {
          throw new Error(`Could not add new Order  ${O.id}. Error: ${err}`)
      }
  }

  async update(Order: Order): Promise<Order> {
    //console.log(Order)
    try {
        const sql = 'UPDATE Orders SET user_id = $1, status = $2  WHERE id=$3  RETURNING * ;'
        // @ts-ignore

        const conn = await Client.connect()

        const result = await conn.query(sql, [Order.user_id , Order.status , Order.id])

        const order = result.rows[0]
        
        conn.release()
        
        return order
         
    } catch (err) {
        throw new Error(`Could not Orders User ${Order.id}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<Order> {
      try {
    const sql = 'DELETE FROM Orders WHERE id=($1) RETURNING *;'
    // @ts-ignore
    const conn = await Client.connect()

    const result = await conn.query(sql, [id])

    const Order = result.rows[0]

    conn.release()

    return Order
      } catch (err) {
          throw new Error(`Could not delete Order ${id}. Error: ${err}`)
      }
  }
  async current(id: string): Promise<Order[]> {
    try {
  const sql = "SELECT * FROM Orders WHERE user_id=($1) AND status='active';"
  // @ts-ignore
  const conn = await Client.connect()

  const result = await conn.query(sql, [id])
    
  const Orders = result.rows

  conn.release()

  return Orders
    } catch (err) {
        throw new Error(`Could not get orders for user_id ${id}. Error: ${err}`)
    }
}
}