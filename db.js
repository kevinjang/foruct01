var tedious = require('tedious')
var Connection = tedious.Connection
var Request = tedious.Request

var config = {
    userName: 'sa',
    password: '506@cofco',
    server: '10.6.5.19',
    database: 'cmstest'
}
let queryRows = []

executeSQLServerState = () => {

    var connection = new Connection(config)


    connection.on('connect', (err) => {
        if (err)
            console.log(err)
        else
            executeStatement();
    })

    executeStatement = () => {
        request = new Request("select top 2 * from dbo.Brc_OC_OUBaseInfo", (err, rowCount) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(rowCount + 'rows');
            }
            connection.close();
        })
        let i = 0;
        let sdRows = []
        request.on('row',(columns)=>{
            // console.log('i',++i);

            
            // let row = {}

            columns.forEach((column)=>{
                if(column.value === null){
                    console.log('Column NULL')
                }
                else{
                    // console.log('column.metadata.colName',column.metadata.colName)
                    // console.log('column', column)
                    const mycol = Object.assign({},{
                        colName: column.metadata.colName,
                        colVal: column.value
                    })

                    // console.log('mycol',mycol)

                    sdRows.push(mycol)
                }
            })

            queryRows.push(sdRows)
            return queryRows
        })
        connection.execSql(request);
    }
}

module.exports = {executeSQLServerState,queryRows}