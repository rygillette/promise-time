//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// Problem Statement                                                                                            //
// We need a function that sums a list of arrays that are populated in X amount of time                         //
// Condition 1 - At minimum, gathering process needs to run a variable amount of time                           //
// Condition 2 - Once minimum time has passed, sum process should consider (n-1) entries                        //
// Condition 3 - If (n-1) entries aren't received after a maximum time threshold, process should give up        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// constant values that the timing calculations will be based off of
const upperLimit = 5;
const randoMultiplier = 5000;
const callCount = 5;
const initialTimeout = 50;
const maxRetries = 300;

// function that populates an array of numbers after a calculated timeout
var requestNumbers = function() {
    let outgoingArray = [];
    let startCount = 1;
    const timeOutVal = Math.random() * randoMultiplier;

    return new Promise(r => setTimeout(r, timeOutVal))
        .then(() => {
            console.log(timeOutVal);
            outgoingArray = [];

            for (var i=0; i<upperLimit; i++){
                outgoingArray.push(startCount);
                startCount += 1;
            }

            { return outgoingArray; }
        });
};

var returnedResults = [];

// async function that calls our number grabber to push array of numbers to a process array [][]
async function p() {
    requestNumbers().then(function(data){
        returnedResults.push(data);
    })
}

// timeout acting as a sleep function for wait situations
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// total sum value needs to have X amount of values to continue... going to give up after 5 minutes though
var waitCondition = async function() {
    for (var i=0; i<maxRetries; i++) {
        if (returnedResults.length > (callCount - 1)) {
            return;
        }

        await sleep(1000);
    }
}

// an initial timer, as the processing is to run in a minimum of {initialTimeout} milliseconds
async function timerFunction() {
    return new Promise(r => setTimeout(r, initialTimeout));
}

// wrapper function that sequentially calls the minimum and maximum time based functions
async function wrapperFunction() {
    try {
        let function1 = await timerFunction();
        let function2 = await waitCondition();
    } catch(err) {
        console.log(err);
        throw err;
    }
}

// function to sum our array of all integers within its children based on what we have at the total timeout
async function getSum() {
    let answer = 0;
    const startTime = new Date().getTime();

    // calling the number processing a certain number of times
    for (var i=0; i<callCount; i++) {
        p();
    }

    // calling our processing wrapper
    await wrapperFunction();

    // if we have the appropriate number of results, sum what we have together
    if (returnedResults.length > callCount - 1) {
        returnedResults.forEach(function(value) {
            value.forEach(function(v2) {
                answer += v2;
            });
        });

        console.log(`${answer} ran in ${(new Date().getTime() - startTime)} milliseconds`);
    } else {
        console.log(`timed out after ${(new Date().getTime() - startTime)} milliseconds`);
    }
}

getSum();