import e from "express"
import { router } from './routes'

const PORT = process.env.PORT || 3000
const app = e()

app.use(router)
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`))

export { app }
