var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
const request = require('request');

// 資料庫config
const { Client } = require('pg')
const client = new Client({
    host: '10.20.30.208',
    port: 5555,
    user: 'stock',
    password: 'stock@123',
})

let isConnection = false

/* GET home page. */
router.get('/:date', async function (req, svres, next) {
    let date = req.params && req.params.date ?
        req.params.date :
        dateFormat(new Date(), "yyyymmdd");


    console.log(`使用時間${date}`);
    let result = await getStore(date)
    if (result) {
        savepg(result, date, svres)
    } else {
        console.log('empty');
    }
});

function getStore(params) {
    return new Promise(function (resolve, reject) {
        request.get(
            `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${params}&type=ALLBUT0999`,
            (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let data;
                    try {
                        data = JSON.parse(body);
                        const result = data.data9.map(item => {
                            return {
                                id: item[0],
                                name: item[1],
                                buycount: item[12],
                                sellcount: item[14],
                            }
                        })
                        resolve(result)
                    } catch (err) {
                        console.log('API抓取錯誤', error);
                        reject();
                    }
                } else {
                    console.log(`error ${error}`);
                    reject();
                }
            },
        )
    })
}

async function savepg(result, date, svres) {
    // 清除資料庫
    console.log(client);
    if (!isConnection)
        await client.connect().then(
            () => {
                isConnection = true
            }
        );

    console.log('succese');
    await client
        .query('truncate table store.stota')
        .then((res) => {
            console.log('clear stota')
        })
        .catch(e => console.error(e.stack))

    //1. 組合字串 並寫入代號
    let tsqlstr = ''
    result.forEach(item => {
        tsqlstr += `INSERT INTO store.stota("id", "name") VALUES ('${item.id}', '${item.name}');`;
    });

    await client
        .query(tsqlstr)
        .then((res) => {
            console.log('complete stota')
        })
        .catch(e => console.error(e.stack))

    console.log(`存檔日期:${date} 存檔數量:${result.length}`);
    await client
        .query(`DELETE FROM store.stotb where opdate='${date}'`)
        .then((res) => {
            console.log('clear stotb')
        })
        .catch(e => console.error(e.stack))
    tsqlstr = ''
    result.forEach(item => {
        let mrate = (Number(item.buycount.replace(',', '')) / (Number(item.sellcount.replace(',', '')) + Number(item.buycount.replace(',', '')))) * 100
        isNaN(mrate) ? mrate = 0 : mrate
        tsqlstr += `INSERT INTO store.stotb (id, opdate, purchase_count, sell_count, compare_rate) VALUES ('${item.id}', '${date}', '${item.buycount}','${item.sellcount}',${mrate.toFixed(2)});`;
    });

    await client
        .query(tsqlstr)
        .then((res) => {
            console.log('complete stotb')
            if (svres) {
                svres.send('complete update');
            }
        })
        .catch(e => console.error(e.stack))

}

async function doSaveDate(params) {
    const date = dateFormat(new Date(), "yyyymmdd")
    let result = await getStore(date)
    if (result) {
        savepg(result, date)
    } else {
        console.log('empty');
    }
}

module.exports = { storeRouter: router, doSaveDate };
