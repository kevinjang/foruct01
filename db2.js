const sql = require('mssql')

const config = {
    user: 'sa',
    password: '506@cofco',
    server: '10.6.5.19',
    database: 'cmstest'
}
// sql.connect()

query = async ({parentid, pageSize,currentPage}) => {
    let result;
    let tcount = pageSize || 10
    result = await (async () => {
        try {
            let pool = await sql.connect(config)
            let start = (currentPage - 1) * tcount


            console.log('start',start)

            let result1 = await pool.request()
                // .input()
                .query(`select top ${tcount} * from
                (SELECT ROW_NUMBER() over(order by ordnum) as rownum,
                        [Id]
                        ,[Name]
                        ,[OULevel]
                        ,[OrdNum]
                        ,[RecordCreationTime]
                        ,[LastUpdateTime]
                        ,case [RecordStatus] when '2' then '已删除' 
                            when '1' then '在用' end [RecordStatus]
                  FROM [CMSTEST].[dbo].[Brc_OC_OUBaseInfo]
                  where ParentID = ${parentid}
                  and RecordStatus = 1) x
                  where x.rownum > ${start}
                `);

            // const rs = result1.recordsets;

            let allcount;// parentid下面共计行数

            allcount = await pool.request()
            .query(`select count(1) allcount from dbo.Brc_OC_OUBaseInfo where RecordStatus = 1 and ParentID = ${parentid}`);

            pool.close();
            sql.close();
            return {result1,allcount}
        } catch (error) {
            throw error
        }
    })()

    sql.on('error', err => {
        // console.log(err)
    });

    return result;
}

getColumnsRelation = async (tableName)=>{
    let result ;
    result = await (async ()=>{
        try {
            let pool = await sql.connect(config)
            let result1 = await pool.request()
            .query(`select * from dbo.TableColumnTitleRelations where TableName = '${tableName}'`);

            pool.close();
            sql.close();
            return result1;
        } catch (error) {
            throw error
        }
    })()

    sql.on('error',err=>{
        throw err
    });

    return result;
}

module.exports = { query, getColumnsRelation }