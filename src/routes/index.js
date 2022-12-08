import e from "express"
const router = e.Router()

router.get('/', (req, res) => {
  res.send('Hello')
})

export { router }
