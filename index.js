const express = require('express')
const { query } = require('./db2')
const app = express()

// app.use
app.all('*', function (req, res, next) {
    res.set({
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
        "Access-Control-Allow-Headers": "X-Requested-With",
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    next()
})

app.get('/api/getOUBaseInfoAll', (req, res, next) => {
    query().then(result => {
        const rows = result.recordsets[0];

        let colInfo = [];

        if(rows && rows.length > 0){
            const item = rows[0]
            for (var item1 in item) {
                const col = {
                    dataIndex: item1,
                    key: item1,
                    title: item1
                }
                
                colInfo.push(col)
            }
        }

        // rows.forEach(item => {
        //     for (var item1 in item) {
        //         const col = {
        //             dataIndex: item1,
        //             key: item1
        //         }

        //         colInfo.push(col)
        //     }
        // })

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