import axios from 'axios'

// export async function request(url: string, config?: AxiosRequestConfig) {
//   try {
//     const res = await axios({ url, ...config })

//     return res.data
//   }
//   catch (error) {
//     console.log('request error', error)
//   }
// }

export const getCToken = () => {
  const cookies = document.cookie.split(';')
  const cToken = cookies.find(cookie => cookie.includes('ctoken'))

  return cToken?.split('=')[1]
}

const request = axios.create({
  // withCredentials: true,
})

request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  console.log('request error', error)
})

export { request }
