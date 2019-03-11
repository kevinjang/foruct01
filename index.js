const express = require('express')
// const {executeSQLServerState,queryRows} = require('./db')
const { test } = require('./db2')
const app = express()

// app.use
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", 
        "token,Origin, X-Requested-With, Content-Type, Accept,mid,X-Token")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
})

app.get('/api/getOUBaseInfoAll', (req, res, next) => {
    // db.executeSQLServerState()
    // const qr = await executeSQLServerState();
    // console.log('qr',qr)
    test().then(result => {
        // res.send(result.recordsets)

        const rows = result.recordsets[0];

        let colInfo = [];

        rows.forEach(item => {
            // console.log('item',item)
            // item.forEach(item1=>{
            //     console.log('key',item1);
            // })

            for (var item1 in item) {
                // console.log('key',item1);
                const col = {
                    dataIndex: item1,
                    key: item1
                }

                colInfo.push(col)
            }
        })


        // console.log('rows',rows)
        res.json({
            datasource: rows,
            columns: colInfo
        })
    })
        .catch(err => {
            console.log('err', err)
        });
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))