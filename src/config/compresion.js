import express from "express"
import compression from "express-compression"

const app = express()

app.use(compression({
    brotli: { enabled: true, zlib: {} }
}))

app.listen(8080, () => console.log("Running... "))

app.get("/stringlargo", (req, res) => {
    let string = `This string is too long !!!!`
    for (let i = 0; i < 10e4; i++) {
        string += `<br>We are doing this string longer</br>`
    }
    res.send(string)
})
