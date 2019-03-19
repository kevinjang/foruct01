const express = require('express')
const { query, getColumnsRelation } = require('./db2')
const { queryCRSEventTitle } = require('./iprm')
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

/**
 * 17 Brc_BPM_Oc
 */
app.get('/api/getOUBaseInfoAll', (req, res, next) => {

    const { parentid,pageSize,currentPage } = req.query
    // console.log('params',params)
    query({parentid,count:pageSize,currentPage}).then(resultx => {
        const {result1,allcount} = resultx
        // console.log('result1',result1)
        // console.log('allcount',allcount.recordset[0].allcount)
        const allcountReal = allcount.recordset[0].allcount
        const rows = result1.recordsets[0].sort((v1,v2)=>{
            return v1.OrdNum > v2.OrdNum
        });

        let colInfo = [];

        if (rows && rows.length > 0) {
            const item = rows[0]

            let tcr = [];
            getColumnsRelation('OUBaseInfo').then(res1 => {
                tcr = res1.recordsets[0]

                for (var item1 in item) {
                    for (let colx in tcr) {
                        const tcrItem = tcr[colx]
                        if (tcrItem.ColumnName === item1) {
                            const col = {
                                dataIndex: item1,
                                key: item1,
                                title: tcrItem.ColumnTitle
                            }
                            colInfo.push(col)
                        }
                    }
                }
                res.json({
                    datasource: rows,
                    columns: colInfo,
                    allcount: allcountReal
                })
            }).catch(err => {
                console.log('err', err)
            })
        }
    }).catch(err => {
            console.log('err', err)
        });
})

/**
 * 19 GWWPcfSysDB
 */

app.get('/api/getCRSEventTitle',(req,res,next)=>{
    const {pageSize, currentPage} = req.query
    queryCRSEventTitle({pageSize,currentPage}).then(resultx=>{
        const {result1,allcount} = resultx
        const allcountReal = allcount.recordsets[0].allcount
        const rows = result1.recordsets[0].sort((v1,v2)=>{
            return v1.ROWNUMBER > v2.ROWNUMBER
        })

        res.json({
            datasource: rows,
            allcount: allcountReal
        })
    })
    .catch(err=>{
        console.log('getCRSEventTitle-err',err)
    })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
