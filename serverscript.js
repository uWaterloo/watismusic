// DATABASE PERSISTENCE EXAMPLE

// YOUTUBE DATA
function getRecommended(numToRetrieve){
    var n = numToRetrieve || 5;
    // todo: limit
    var queryResult = db.Execute('SELECT * FROM songs ORDER BY rating DESC');

    return JSON.stringify({status:"retrieved", data:queryResult});

}

function insertSuggestion() {
  var data = JSON.parse(args.Get("data"));
  var q = 'INSERT INTO songs VALUES('+data.title +', '+data.artist+', '+data.linkID+', '+0+', '+data.genre+')';
  //return q;
  //return data;
    db.Execute(q);
    return getRecommended();
}

// Retreive data from the database
function getData() {
    var queryResult = db.Execute('SELECT * FROM sampleTable');
    var rows = JSON.parse(queryResult);
    if (rows.length > 0 && typeof rows[0].Error != 'undefined') {
        return '{"status":"noTable"}';
    }
    return queryResult;
}

// Create table
function createTable() {
    var result = {};

    var queryResult = db.Execute('SELECT TOP 1 * FROM sampleTable');
    var row = JSON.parse(queryResult);

    if (row.length > 0 && typeof row[0].Error != 'undefined') {
        db.Execute('CREATE TABLE sampleTable(id INTEGER PRIMARY KEY IDENTITY(1,1), userId nvarchar(50), value nvarchar(50));');
        result = '{"status":"tableCreated"}';
    } else
        result = '{"status":"tableExist"}';

    return JSON.stringify(result);
}

// Insert into the databases
function insert() {
    if (args.Get("value").length > 50)
        return '{"result":"error"}';
    else {
        db.Execute('INSERT INTO sampleTable VALUES(@currentUser,@value)');
        return getData();
    }
}

// OPEN DATA API EXAMPLE

function getOpenData() {
    var apiKey = ""; // Paste your API key here. IMPORTANT: DO NOT PUSH THIS TO GITHUB, STORE KEY IN DB
    if (apiKey == "")
        return '{"error":"No Api Key! Add your key in the server script file."}';

    return proxy.GetProxy('https://api.uwaterloo.ca/v2/foodservices/watcard.json?key=' + apiKey);
}
