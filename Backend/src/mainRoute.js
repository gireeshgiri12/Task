const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const mainRoute = express()
mainRoute.use(express.json())
mainRoute.use(cors())
const AgencyDetails = require('../module/agencyschema')
const clientDetails = require('../module/clientschema')

const port = process.env.PORT || 8000

mongoose
  .connect(
    process.env.DATABASE_URL ||
      'mongodb://gireesh:gireesh123@167.235.135.56:31120/task',
  )
  .then(() => {
    console.log('sucessfully connected to task collection')
  })
  .catch((e) => console.log(e))
mainRoute.listen(port, () => {
  console.log(`your server is running at ${port}`)
})

mainRoute.post('/create', async (req, res) => {
  try {
    const agencyData = [
      'Name',
      'Address1',
      'Address2',
      'State',
      'PhoneNumber',
    ].reduce(
      (a, b) => (req.body[b] ? Object.assign(a, { [b]: req.body[b] }) : a),
      {},
    )
    const clientData = [
      'clientName',
      'clientEmail',
      'clientPhoneNumber',
      'TotalBill',
    ].reduce(
      (a, b) => (req.body[b] ? Object.assign(a, { [b]: req.body[b] }) : a),
      {},
    )
    const data = await AgencyDetails.findOne({ Name: req.body.Name })
    if (data) {
      res
        .status(400)
        .send({ message: 'Name already Exist! try with Diff Name' })
    } else {
      const agencyResult = await AgencyDetails.create(agencyData)
      clientData.AgencyId = agencyResult._id
      const clientResult = await clientDetails.create(clientData)
      res.status(201).json({
        message: 'Congratulations Agency and Client Creation successful!',
        agencyDetails: agencyResult,
        clientDetails: clientResult,
      })
    }
  } catch (err) {
    res.status(502).send({
      message: err.message,
    })
  }
})

mainRoute.put('/clients/:clientId', async (req, res) => {
  try {
    const data = await AgencyDetails.findOne({ _id: req.params.clientId })
    if (data) {
      await clientDetails.findByIdAndUpdate(req.params.clientId, req.body)
      const updatedClient = await clientDetails.findById(req.params.clientId)
      res
        .status(201)
        .send({ message: 'Client Updation Successful', updatedClient })
    } else {
      res.status(404).send({ message: 'Client Not Found' })
    }
  } catch (err) {
    res.send({
      message: err.message,
    })
  }
})

mainRoute.get('/topClients', async (req, res) => {
  try {
    const clients = await clientDetails.find({}).populate({
      path: 'AgencyId',
      select: 'Name',
    })
    const data = clients
      .map((client) => {
        return {
          AgencyName: client.AgencyId.Name,
          ClientName: client.clientName,
          TotalBill: client.TotalBill,
        }
      })
      .filter(Boolean)
    data.sort(function (a, b) {
      return a.TotalBill - b.TotalBill
    })
    data.reverse()
    const result = data.slice(0, 5)
    res
      .status(200)
      .send({ message: 'Top 5 Clients Based On TotalBill', result })
  } catch (err) {
    res.send({
      message: err.message,
    })
  }
})
