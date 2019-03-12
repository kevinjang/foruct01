const sql = require('mssql')

const config = {
    user: 'sa',
    password: '506@cofco',
    server: '10.6.5.19',
    database: 'cmstest'
}
// sql.connect()
query = async () => {
    let result;
    result = await (async () => {
        try {
            let pool = await sql.connect(config)
            let result1 = await pool.request()
                .query('select top 10 * from dbo.Brc_OC_OUBaseInfo where RecordStatus = 1');

            const rs = result1.recordsets;

            pool.close();
            sql.close();
            return result1
        } catch (error) {
            throw error
        }
    })()

    sql.on('error', err => {
        console.log(err)
    });

    return result;
}

module.exports = { query }