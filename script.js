const firebaseConfig = {
    apiKey: "AIzaSyDzTb_QS1cbEwwI3YTdSMmYwCQ-w3ms6gc",
    authDomain: "expenses-web-e4f0e.firebaseapp.com",
    projectId: "expenses-web-e4f0e",
    storageBucket: "expenses-web-e4f0e.appspot.com",
    messagingSenderId: "1041616644641",
    databaseURL:"https://expenses-web-e4f0e-default-rtdb.asia-southeast1.firebasedatabase.app/",
    appId: "1:1041616644641:web:94fb863c6d5edff99cd160",
    measurementId: "G-2TMBWEFBY0"
  };


var app = firebase.initializeApp(firebaseConfig)
var db = firebase.database()


function encode(s){
    let res = "";
    for(let i = 0 ; i < s.length ; i++){
        if(s[i] == ' ') res += '|'
        else res += s[i];
    }
    return res;
}

let currentPath = 'main/'
function addDB(dict){
//   firebase.database().ref(path).on('value' , function(snap){
//     let data = snap.val()
//     let id = 1
//     for(let x in data){
//       id++;
//     }
//     db.ref(path + id).set(dict);
//     return id
//   })
    let d = new Date()
    let min = d.getMinutes()
    let hour = d.getHours()
    let sec = d.getSeconds()
    let date = d.getDate()
    let month = d.getMonth() + 1
    let year = d.getFullYear()
    db.ref(currentPath + sec + '|' + min + '|' + hour + '|' + date + '|' + month + '|' + year + '|' + dict.rs + '|' + dict.reason).set(dict);
    console.log("done");
}

function getTime(){
    let d = new Date()
    let min = d.getMinutes()
    let hour = d.getHours()
    let sec = d.getSeconds()
    let date = d.getDate()
    let month = d.getMonth() + 1
    let year = d.getFullYear()
    return sec + '|' + min + '|' + hour + '|' + date + '|' + month + '|' + year
}

// addDB({
//   rs : 40,
//   reason : 'this is the reason'
// })


function getALL() {
    firebase.database().ref(currentPath).on('value' , function(snap) {
        let data = snap.val()
        console.log(data);
        let target = document.getElementById("data")
        target.innerHTML = ""

        let today = new Date()

        let TODAY = 0 , THIS_MONTH = 0;
        let store = []
        for(let element in data){
            store.push(element)
            let temp = element.split('|')
            let date = temp[3]
            let month = temp[4]
            let year = temp[5]
            let rs = temp[6]

            if(date == today.getDate() && month == today.getMonth() + 1 && year == today.getFullYear()){
                TODAY += parseInt(rs);
            }

            if(month == today.getMonth() + 1 && year == today.getFullYear()){
                THIS_MONTH += parseInt(rs);
            }

            
        }
        for(let i = 0 ; i < store.length ; i++){
            for(let j = i + 1 ; j < store.length ; j++){
                let temp1 = store[i].split('|')
                let temp2 = store[j].split('|')
                let date1 = temp1[3]
                let date2 = temp2[3]
                let month1 = temp1[4]
                let month2 = temp2[4]
                let year1 = temp1[5]
                let year2 = temp2[5]

                let date_i = new Date(year1 , month1 - 1 , date1)
                let date_j = new Date(year2 , month2 - 1 , date2)

                if(date_i.valueOf() < date_j.valueOf()){
                    let swap = store[i];
                    store[i] = store[j];
                    store[j] = swap;
                }
            }
        }

        for(let i = 0 ; i < store.length ; i++){
            let temp = store[i].split('|')
            let date = temp[3]
            let month = temp[4]
            let year = temp[5]
            let rs = temp[6]
            let reason = temp[7]
            target.innerHTML += `
            <tr>
                <td>${date + "-" + month + "-" + year}</td>
                <td>${rs}</td>
                <td>${reason}</td>
            </tr>
            `
        }

        document.getElementById("today").innerText = TODAY
        document.getElementById("month").innerText = THIS_MONTH
    })
}

getALL()


document.getElementById("add").addEventListener("click" , function(){
    let rs = document.getElementById("rs").value
    let reason = document.getElementById("reason").value
    if(rs == null || rs == undefined || rs == 0){
        alert('Enter RS :)')
        return
    }
    addDB({
        rs,
        reason
    })
})


// let d = new Date(2022 , 9 , 10)
// let d2 = new Date(2022 , 9 , 11)
// console.log(d.valueOf());
// console.log(d2.valueOf());
