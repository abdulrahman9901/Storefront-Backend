// @ts-ignore
import Client from '../database'

export type Product = {
     id?: Number;
     name: string, 
     price: Number,
     category: string
}

export class ProductStore {
  authenticate(username: any, password: any) {
    throw new Error('Method not implemented.');
  }
  async index(): Promise<Product[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT * FROM Products'
  
      const result = await conn.query(sql)
  
      conn.release()
  
      return result.rows 
    } catch (err) {
      throw new Error(`Could not get Products. Error: ${err}`)
    }
  }

  async show(id: string): Promise<Product> {
    try {
    const sql = 'SELECT * FROM Products WHERE id=($1)'
    // @ts-ignore
    const conn = await Client.connect()

    const result = await conn.query(sql, [id])

    conn.release()

    return result.rows[0]
    } catch (err) {
        throw new Error(`Could not find Product ${id}. Error: ${err}`)
    }
  }

  async create(P: Product): Promise<Product> {
      try {
    const sql = 'INSERT INTO Products (name, price, category) VALUES($1, $2, $3) RETURNING *'
    // @ts-ignore
    const conn = await Client.connect()

    const result = await conn
        .query(sql, [P.name, P.price, P.category])

    const Product = result.rows[0]

    conn.release()

    return Product
      } catch (err) {
          throw new Error(`Could not add new Product ${P.name}. Error: ${err}`)
      }
  }
  
  async update(Product: Product): Promise<Product> {
    //console.log(Product)
    try {
        const sql = 'UPDATE Products SET name=$1 , price=$2, category=$3 WHERE id=$4  RETURNING *'
        // @ts-ignore

        const conn = await Client.connect()

        const result = await conn.query(sql, [Product.name , Product.price , Product.category , Product.id])

        const product = result.rows[0]
        
        conn.release()
        
        return product

    } catch (err) {
        throw new Error(`Could not update Products ${Product.name}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<Product> {
      try {
    const sql = 'DELETE FROM Products WHERE id=($1) RETURNING * ;'
    // @ts-ignore
    const conn = await Client.connect()

    const result = await conn.query(sql, [id])

    const Product = result.rows[0]

    conn.release()

    return Product
      } catch (err) {
          throw new Error(`Could not delete Product ${id}. Error: ${err}`)
      }
  }
}