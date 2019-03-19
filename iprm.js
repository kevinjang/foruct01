const sql = require('mssql')
const config = {
    user: 'sa',
    password: '506@cofco',
    server: '10.6.5.19',
    database: 'GWWPcfSysDB'
}

queryCRSEventTitle = async ({pageSize, currentPage}) => {
    pageSize = pageSize || 10
    let result = await (async () => {
        try {
            let pool = await sql.connect(config)
            let start = (currentPage - 1) * pageSize

            let result1 = await pool.request()
                .query(`select top ${pageSize} * from 
                (SELECT ROW_NUMBER() over(order by submittime desc) ROWNUMBER
                ,[GUID]
                ,[CRSEventCode]
                ,[CustomerName]
                ,[CusContractCode]
                ,[CusSalesMan]
                ,[PhoneNo]
                ,[TheatreCommand]
                ,[Province]
                ,[Office]
                ,[LocateProvince]
                ,[LocateCity]
                ,[LocateDistrict]
                ,[ComplainContent]
                ,[SubmitTime]
                ,[EventStatu]
                ,[UserAccountID]
                ,[ProofStatu]
                ,[ProofID]
                ,[BUDept]
                ,[CreateTime]
                ,[ZhanQuCode]
            FROM [dbo].[CRSEventTitle]) as t1
            where rownumber > ${start}`);

            let allcount = 0;

            allcount = await pool.request()
                .query(`select count(1) FROM [dbo].[CRSEventTitle]`);

            pool.close()
            sql.close()

            return {result1,allcount}
        } catch (error) {
            throw error            
        }
    })()

    sql.on('error',err=>{
        console.log(err)
    })

    return result
}

module.exports = {
    queryCRSEventTitle
}