
const  CURRENT_TOURNAMENT = "https://tournaments-api.zed.run/tournaments?status=qualification"


const calculateStats = (myRaceStats, raceLength, horseClass) => {
    
    let numOf1000Races = 0
    let wins = 0 
    let placeds = 0 
    let horseName = ""
    let horseImg
    
    const oneThousandRaces = myRaceStats.filter( (lengthRace) =>{
        if( lengthRace != undefined && lengthRace.raceLength == raceLength && lengthRace.class == horseClass){
          horseName = lengthRace.name
          horseImg = lengthRace.img
           numOf1000Races++;
          if( lengthRace.position == 1){
            wins++
            placeds++
          }
          if( lengthRace.position == 2 || lengthRace.position == 3){
            placeds++
          }
        }
        return(lengthRace != undefined && lengthRace.raceLength == raceLength )
    })

   // console.log( "Length: " + raceLength )
   // console.log( "Races: " + numOf1000Races )
   // console.log( "Wins " + wins/numOf1000Races * 100 )
   // console.log( "Placed " + placeds/numOf1000Races * 100  )
   // console.log("============================================")

    return({ horseName: horseName, Length: raceLength, Races: numOf1000Races, Wins: wins/numOf1000Races * 100, Placed: placeds/numOf1000Races * 100, img: horseImg })

}
export default calculateStats 

export const calculeMaxWinPlaceStats = (racesStats, aHorseId, aHorseClass) => {

  let horsesRacesInfo = racesStats.map( (race) => { 
    const myhorse = race.node.horses.find( (horse) => horse.horseId === aHorseId )
    if( myhorse != undefined )
    {
      return( { name: myhorse.name, raceLength: race.node.length, position: myhorse.position, img: myhorse.imgUrl, class: myhorse.class })
    }
    else{
      console.log("Horse Historical Race Data Missing")
    }
    })

  let maxWins = 0;
  let maxRace 

  for( let i=0; i<9; i++){
    let raceLength = (i * 200 ) + 1000
    const raceStats = calculateStats(horsesRacesInfo, raceLength, aHorseClass)
    if( raceStats.Wins > maxWins ){
      maxWins = raceStats.Wins
      maxRace = raceStats
    }
  }
  return(maxRace)
} 

export const AgregatePositions = (racesStats, aHorseId) => {

  let horsePositions = []
  let horseRacelength = []

  racesStats.map( (race) => { 
    const myhorse = race.node.horses.find( (horse) => horse.horseId === aHorseId )
    if( myhorse != undefined ){
      horsePositions.push( myhorse.position )
      horseRacelength.push( race.node.length/100 )
    }
  })

 // console.log(horsePositions)
 // console.log(horseRacelength)

  return( { name: "",  img: "",  raceLength: horseRacelength, position: horsePositions, preferLength: undefined, winPecent: 0, placePercent: 0, tourneyPoints: 0})
} 

export const CalculateTournamentPoints = (horsesRacesInfo, tournamentPoints) => {
  let myTournamentPoints = 0
  let pointsAverage = 0

  //console.log( racesPositions)

  //console.log( "Points"  + tournamentPoints)
  //console.log( horsesRacesInfo.position.length)

  if( horsesRacesInfo.position.length > 0  ){
    for(let i=0; i<horsesRacesInfo.position.length; i++){
      if( tournamentPoints[horsesRacesInfo.position[i]-1] != undefined ){
        myTournamentPoints += tournamentPoints[horsesRacesInfo.position[i]-1];
      }
    }
  pointsAverage = myTournamentPoints/horsesRacesInfo.position.length;
  }

  return(pointsAverage) 
}

export async function GetCurrentTournament() {

  let qualifyingTournament = []  

  let response = await fetch(CURRENT_TOURNAMENT) 
  let trounamentsData = await response.json()  
  qualifyingTournament = [...qualifyingTournament,...trounamentsData]
  
  qualifyingTournament.sort( (a,b) => a.qualificationEndDate - b.qualificationEndDate)

  return(qualifyingTournament[0])
}


