const API_BASE_URL = 'http://localhost:3001'

export const api = {
  async getEcosystem() {
    const response = await fetch(`${API_BASE_URL}/ecosystem`)
    if (!response.ok) throw new Error('Failed to fetch ecosystem data')
    return response.json()
  },

  async getCustomerSeries() {
    const response = await fetch(`${API_BASE_URL}/customerSeries`)
    if (!response.ok) throw new Error('Failed to fetch customer series data')
    return response.json()
  },

  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  async getUserById(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`)
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  },

  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/products`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  async getProductById(id: number) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  },

  async createUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error('Failed to create user')
    return response.json()
  },

  async updateUser(id: number, userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error('Failed to update user')
    return response.json()
  },

  async deleteUser(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete user')
    return response.json()
  }
}