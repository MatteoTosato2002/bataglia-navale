const faker = require("faker")
const express = require("express")
const { query } = require("express")
const app = new express()
const PORT = 8080

const teams = {
  pippo: {
    name: "pippo",
    password: "cavallo",
    score: 100,
    killedShips: [],
    firedBullets: 10,
    lastFiredBullet: new Date().getTime()
  }
}
const field = []
const ships = []

const W = 6
const H = 6
const S = 6

for (let y = 0; y < H; y++) {
  const row = []
  for (let x = 0; x < W; x++) {
    row.push({
      team: null,
      x,
      y,
      ship: false,
      sid: null,
      hit: false
    })
  } 
  field.push(row)
}

let id = 0
for (let i = 0; i < S; i++) {
  const maxHp = faker.random.number({ min: 1, max: 3 })

  const ship = {
    id,
    name: faker.name.firstName(),
    x: faker.random.number({ min: 0, max: 5 }),
    y: faker.random.number({ min: 0, max: 5 }),
    maxHp,
    curHp: maxHp,
    alive: true,
    killer: null
  }

  let found = false
  console.log(field[ship.x][ship.y])
  if (field[ship.x][ship.y].ship) {
    found = true
    i += 1
    }
  if (!found) {
      field[ship.x][ship.y].ship = true
      field[ship.x][ship.y].sid = id  
      id += 1  
      ships.push(ship)
    }
  }


app.get("/", ({ query: { format } }, res) => {
  const visibleField = field.map(row => row.map(cell => ({ 
    x: cell.x,
    y: cell.y,
    hit: cell.hit,
    team: cell.team,
    ship: cell.hit ? 
      cell.ship ? { id: cell.ship.id, name: cell.ship.name, alive: cell.ship.alive, killer: cell.ship.killer } : null 
      : null
  })))

  const visibleShipInfo = ships.map(ship => ({
    id: ship.id,
    name: ship.name,
    alive: ship.alive,
    killer: ship.killer
  }))

  if ( format === "json") {
    res.json({ 
      field: visibleField,
      ships: visibleShipInfo
    })
  } else {
    // html format field
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>battaglia navale</title>
      <style>
        table, td, th {
          border: 1px solid black;
        }

        td {
          width: 40px;
          height: 40px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
      </style>
    </head>
    <body>
      <table>
        <tbody>
          ${visibleField.map(row => `<tr>${row.map(cell => `<td>${cell.ship ? cell.ship.name : ""}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </body>
    </html>
    `)
  }
})

app.get("/score", (req, res) => {
  res.json([])
})

app.get("/signup", (req, res) => {
  res.send(`
  <!DOCTYPE html>
    <html>
    <head>
    <title>battaglia navale signup</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
  </head>
  <div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
  <label for="floatingInput">Email address</label>
  </div>
  <div class="form-floating">
  <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
  <label for="floatingPassword">Password</label>
  </div>
  <button type="button" class="btn btn-primary">Signup</button>`)
})

console.log(field)
app.get("/fire", ({ query: { x, y, team, password } }, res) => {
  if(teams[team].password === password){
  xh = parseInt(x)
  yh = parseInt(y)
  let tempo = new Date().getTime()
  let punteggio = 0
  if (tempo - teams[team].lastFiredBullet > 1500 ){
  if(teams[team].password === password){
    if(x>W || y>H) {teams[team].score -= 50000}else{ 
    field.forEach( z => {
      z.forEach(e => {
      if (e.x === xh && e.y === yh){
        if(!e.hit){
          e.hit = true
          e.team = team
          if (e.ship) {
            ships[e.sid].curHp -= 1
            if (ships[e.sid].curHp === 0) {
              e.ship.alive = false
              e.ship.killer = team
              teams[team].score += 30
              console.log("preso")
              punteggio += 30
            } else {
              teams[team].score += 10
              punteggio += 10
              console.log(ships[e.sid])
            }
          }
        } else {teams[team].score -= 5}
      }
    })})
    teams[team].lastFiredBullet = new Date().getTime()
  }} else { console.log("brutto hacker vai a mangiare il tonno")}
  res.json({"score" : punteggio})
}}})


app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port ", PORT))