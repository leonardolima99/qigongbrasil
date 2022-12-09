const e = require("express");
const { router } = require("./routes/index.js");

const PORT = process.env.PORT || 3000;
const app = e();

app.use(router);
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

module.exports = { app };
