const { time } = require('faker')
const fetch = require('node-fetch')

let inizio = new Date().getTime()

const timer = () => {
    let ora = new Date().getTime()
    while(ora - inizio < 2000){
        ora = new Date().getTime()
    }
    inizio = ora}


const player = async () => {
    for(let x = 0; x < 6; x++){
        for(let y = 0; y < 6; y++){
            let res = await fetch(`http://localhost:8080/fire?x=${x}&y=${y}&team=pippo&password=cavallo`)
            res = await res.json()
            console.log(res.score)
            if(res.score === 10){
                console.log(`nave colpita a x=${x} y=${y}`)
            }else if (res.score === 30){
                console.log(`nave colpita e affondata a x=${x} y=${y}`)
            }
            timer()
        }  
    }
    console.log(`ho finito`)
}

player()