const config = {
    apiUrl: 'http://127.0.0.1:8000/api' // Default to local development
};
  
// Override with production URL if in production environment
if (process.env.NODE_ENV === 'production') {
    config.apiUrl = 'https://vertexx-85dc684c56f3.herokuapp.com/api';
}
  
export default config;