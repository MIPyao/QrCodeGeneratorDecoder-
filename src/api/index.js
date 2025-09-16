import axios from '@/libs/axios'

export const countries = () => {
  return axios.request({
    url: '/api/v1/countries',
    method: 'get',
    headers: {
      isToken:false,
    }
  })
}
