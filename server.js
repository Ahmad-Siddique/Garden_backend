const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const cors = require('cors')
const colors = require('colors')

const session = require('express-session')

const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const helmet = require('helmet')
const cron = require('node-cron')
const bodyParser = require('body-parser')

const axios = require('axios')

const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
dotenv.config({ path: './.env' })


const User = require('./models/User')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)








const app = express()
app.use(helmet({ contentSecurityPolicy: false }))

app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/stripe/webhooks') {
    // Skip this middleware for Stripe webhook route
    next()
  } else {
    // Use express.json() middleware for all other routes
    express.json()(req, res, next)
  }
})
app.use(cookieParser())
app.use(hpp())
app.use(mongoSanitize())

const corsOptions = {
  origin: '*', // Allow all origins
};

app.use(cors(corsOptions));

connectDB()



app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/plants', require('./routes/plant'))
app.use('/api/v1/plantinfo', require('./routes/plantinfo'))
app.use('/api/v1/pests', require('./routes/pest'))
app.use('/api/v1/disease', require('./routes/disease'))
app.use('/api/v1/critters', require('./routes/beneficialCritters'))
app.use('/api/v1/vitamins', require('./routes/vitamin'))
app.use('/api/v1/nutrients', require('./routes/nutrient'))
app.use('/api/v1/effects', require('./routes/effect'))
app.use('/api/v1/calenders', require('./routes/calender'))
app.use('/api/v1/featurerequest', require('./routes/featurerequest'))
app.use('/api/v1/featurerequestcomment', require('./routes/featurerequestcomment'))
app.use('/api/v1/bugreport', require('./routes/bugreport'))
app.use('/api/v1/blog', require('./routes/blog'))




// app.use('/api/v1/stripe', require('./routes/stripe'))



// app.use('/api/v1/admin', require('./routes/admin'))
// Test Commit

// --------------------------DEPLOYMENT------------------------------

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'client', 'build')))

//   app.get('*', (req, res) => {
//     return res.sendFile(
//       path.resolve(__dirname, 'client', 'build', 'index.html'),
//     )
//   })
// } else {
//   app.use(
//     express.static(
//       path.join(__dirname, './../../../../client/_work/chadgpt-front', 'build'),
//     ),
//   )

//   app.get('*', (req, res) => {
//     return res.sendFile(
//       path.resolve(
//         __dirname,
//         './../../../../client/_work/chadgpt-front',
//         'build',
//         'index.html',
//       ),
//     )
//   })
// }

// --------------------------DEPLOYMENT------------------------------

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () =>
  console.log(`Server running on PORT ${PORT}`),
)

// Handling server errors with clean error messages
process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err.message}`)
  server.close(() => process.exit(1))
})









