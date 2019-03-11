const sql = require('mssql')

const config = {
    user: 'sa',
    password: '506@cofco',
    server: '10.6.5.19',
    database: 'cmstest'
}
// sql.connect()
test = async () => {
    let result;
    result = await (async () => {
        try {
            console.log('config', config);
            let pool = await sql.connect(config)
            let result1 = await pool.request()
                // .input
                .query('select top 2 * from dbo.Brc_OC_OUBaseInfo');
            // console.dir('result1',result1)
            console.log('result1', result1)
            // result1 = JSON.stringify(result1)

            const rs = result1.recordsets;
            console.log('recordsets',rs)

            pool.close();
            return result1
        } catch (error) {
            console.log(error)
        }
    })()

    sql.on('error', err => {
        console.log(err)
    });

    console.log(result)

    return result;
}

module.exports = { test }