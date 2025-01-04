import { useLazyQuery } from '@vue/apollo-composable';
import { GET_CARDS, GET_COMMANDERS } from './graphql/queries';


function calculateWinrate(rq, winratePerCard, include, exclude) {
    var nodes = rq?.commander.entries.edges;

    var totalWins = 0;
    var totalGames = 0;
    var totalDraws = 0;

    //for every deck in the page
    for(const node of nodes){
        const wins = node.node.wins;
        const draws = node.node.draws;
        const games = node.node.wins+node.node.losses + node.node.draws;
        const cards = node.node.maindeck;

        totalWins += wins;
        totalGames += games;
        totalDraws += draws;
    //for every card in the deck
        for (const card of cards){
            if ((include == null && exclude == null) || (card in include && !( card in exclude))){
                if (Object.keys(winratePerCard).includes(card.name)){
                    winratePerCard[card.name][1] += wins;
                    winratePerCard[card.name][2] += games;
                    winratePerCard[card.name][3] += draws;
                }
                else{
                    let image = card.imageUrls[0];
                    if(image){
                        image = image.replace("art_crop","small")
                        winratePerCard[card.name] = [0, wins, games, draws, image];
                    }
                    else{
                        winratePerCard[card.name] = [0, wins, games, draws, null];
                    }
                }
            }
        }
    }
    return [totalWins, totalGames, totalDraws]
}
export async function getCardWinrates(commander, time){

    const variables = {
        "name": commander,
        "filters": {
        "timePeriod": time
        },
        "after": null
    };
    var {result, load, error, loading} = useLazyQuery(GET_CARDS, variables);
    var resultF = await load();
    if(error.value){
        return error
    }

    var winratePerCard = {};
    var totalWins = 0;
    var totalGames = 0;
    var totalDraws = 0;
    while (true){
    var [addedWins, addedGames, addedDraws] = calculateWinrate(resultF, winratePerCard, null, null)
    totalWins += addedWins;
    totalGames += addedGames;
    totalDraws += addedDraws;
    if(!(resultF.commander.entries.pageInfo.hasNextPage)){
        break;
    }
    else{
        const variables = {
            "name": commander,
            "filters": {
            "timePeriod": time
            },
            "after": resultF.commander.entries.pageInfo.endCursor
        };

        var {result, load, error, loading} = useLazyQuery(GET_CARDS, variables);
        var resultF = await load();
        if(error.value){
            return error
        }
    }
    }
    //subtract base winrate from each card winrate
    for (const card in winratePerCard){
    if (winratePerCard[card][2] != 0){
        //calculate winrate adjustment
        winratePerCard[card][0] = (winratePerCard[card][1]/winratePerCard[card][2])-(totalWins/totalGames);
        //calculate drawrate adjustment
        winratePerCard[card][3] = (winratePerCard[card][3]/winratePerCard[card][2])-(totalDraws/totalGames);

    }
    else{
        winratePerCard[card][0] = 0;
        winratePerCard[card][3] = 0;
    }
    //inclusion rate
    winratePerCard[card][1] = (winratePerCard[card][2])/totalGames;
    }


    console.log("average winrate:" + (totalWins/totalGames));
    console.log("total games in data:" + (totalGames));

    return [winratePerCard, totalWins, totalGames, totalDraws];
}
export function dictToSortedArray(winratePerCard){
    var sortedArray = [];
    for(const card in winratePerCard){
        //name, winrate, inclusion rate, included games, drawrate
        sortedArray.push([card, winratePerCard[card][0], winratePerCard[card][1], winratePerCard[card][2], winratePerCard[card][3], winratePerCard[card][4]]);
    }
    sortedArray.sort(winrateComparator).reverse()
    return sortedArray;
}
function winrateComparator(a,b){
    if(a[1] < b[1]){
        return -1;
    }
    else if(a[1] > b[1]){
        return 1;
    }
    return 0;
}