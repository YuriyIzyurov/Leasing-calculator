export const inputConverter = (value) => {
   return value
            .toString()
            .replace(/\d $/, '')
            .replace(/\D/g, '')
            .replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ')
}