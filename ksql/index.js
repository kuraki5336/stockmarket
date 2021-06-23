// curl -X "POST" "http://10.20.30.208:8088/query" \
//      -H "Content-Type: application/vnd.ksql.v1+json; charset=utf-8" \
//      -d $'{
//   "ksql": "SELECT * FROM suser WHERE _id>0 emit changes;",
//   "streamsProperties": {"ksql.streams.auto.offset.reset": "earliest" }
// }'


const fs = require('fs');
const axios = require('axios')

function SendSQL(sqlStatement) {
    const config = {
        'Accept': 'application/vnd.ksql.v1+json'
    }
    const ksql_statement = {
        // "ksql": sqlStatement,
        "ksql": sqlStatement,
        "streamsProperties": {}
    }

    axios.post(`http://10.20.30.208:8088/query`, ksql_statement, config)
        .then((res) => {
            console.log(res);
            res.data.forEach(value => {
                console.log(value);
                // DeterminateType(value, value['@type'])
            })
        })
        .catch((error) => {
            console.log("錯誤時，使用者執行指令:", error.response.data.statementText)
            console.error("錯誤訊息：", error.response.data.message)
            console.log("---------------------")
        })

}

console.log(`執行`);
SendSQL(`select * from t1 emit changes;`)
// SendSQL(`SHOW TABLES ; `)