export const generateProductErrorInfo = (product) => {
    return `
    Uno o más propiedades estan implotos o son invalidos.
    Lista de propiedades obligatorias:
        _title : Must be a String   (${product.title})
        _price : Must be a Number   (${product.price})
`}
