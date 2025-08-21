const appcfg = require('./appcfg');
const Connection = require('tedious').Connection; 

const config = appcfg.mssql_cfg

const connection = new Connection(config);

connection.on('connect', function(err) {
    if (err) {
        console.error('Ошибка подключения:', err);
        return;
    }

    console.log('Подключение установлено');
    executeStatement();
});

connection.connect();

function executeStatement() {
    const request = new Request("SELECT  id from films", function(err, rowCount, rows) {
        if (err) {
            console.error('Ошибка запроса:', err);
            return;
        }

        console.log(`${rowCount} строк(и) получено`);
    });

    const result = [];

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log(column.value);
        });
    });

    connection.execSql(request);
}