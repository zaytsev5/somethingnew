const mysql = require('mysql');
//MySql config
const mysqlDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'booking_system'
})
mysqlDB.connect(function(err){
  if(err) return console.log(err)
  console.log("Mysql connected...")
})


module.exports = {
 findPost: function(trip,date,callback){
 	let query = "select * from chuyenxe where MaTX = ? and NgayDi=?";
 	let bind = [];
 	bind.push(trip);bind.push(date)
 	mysqlDB.query(query,bind,(err,result)=>{
 		if(err) return console.log(err)
 		callback(result)
 	})
 },
 findTrip:function(callback){
 	let query = "select * from tuyenxe"
 	mysqlDB.query(query,(err,result)=>{
 		if(err) throw err
 		callback(result)
 	})
 },
 findByEmail : function(email,callback){
 	let query = "select * from users where email = ?";
 	mysqlDB.query(query,email,)
 },
 addOne: function(val1,val2,val3,callback){
 	let bind = [];
 	bind.push(val1);bind.push(val2);bind.push(val3)
 	let query = "INSERT INTO `xe`(`BienSoXe`, `LoaiXe`, `SoChoNgoi`, `MaBX`) VALUES (?,?,30,?)"
 	mysqlDB.query(query,bind,(err,result) =>{
 		if(err) return  callback({isAdded:false})
 		callback({isAdded:true})
 	})
 },
 findPostTime: function(trip,date,time,callback){
 	let query = 'select * from chitietvexe where MACX = (select MaCX  from chuyenxe where MaTX =? and NgayDi=? and gioDi=? and SoVeHienCon > 0)';
 	let bind = [];
 	bind.push(trip);bind.push(date);bind.push(time)
 	mysqlDB.query(query,bind,(err,result)=>{
 		if(err) return console.log(err)
 		callback(result)
 	})
 },
 getTimePost:function(trip,date,callback){
 	let query = 'select MaCX,gioDi from chuyenxe where MaTX =? and NgayDi = ?';
 	let bind = [];
 	bind.push(trip);bind.push(date)
 	mysqlDB.query(query,bind,(err,result)=>{
 		if(err) return console.log(err)
 		callback(result)
 	})
 },
 getAllTrips:function(callback){
 	let query = 'select * from tuyenxe';
 	mysqlDB.query(query,(err, result) =>{
 		if(err) throw err
 		callback(result)
 	})
 },
 getInfoUser:function(email,callback){
 	let query = 'select * from khachhang where Email = ?'
 	mysqlDB.query(query,email,(err, result) =>{
 		if(err) throw err
 		callback(result)
 	})
 },
 save:function(bind,callback){
 	let query = 'INSERT INTO `khachhang`(`CMND`, `TenKH`, `Email`, `SDT`, `GioiTinh`, `DiaChi`) VALUES (?,?,?,?,?,?)'
 	let not = false
 	mysqlDB.query(query,bind,(err,result) =>{
 		if(err) return callback(not)
 		callback(result)
 	})
 },
 findSeat:function(postID,callback){
 	let query = 'select SoGhe from chitietvexe where MaCX=?'
 	let bind = [];
 	bind.push(postID);
 	mysqlDB.query(query,bind,(err,result)=>{
 		if(err) return console.log("a mistake")
 		callback(result)
 	})
 },
 saveTicket:function (bind,callback){
 	let query = 'insert into `vexe`(`MaHD`,`MaVeXe`,`CMND`,`NgayDat`) values (?,?,?,?)'
 	let not = false;
 	mysqlDB.query(query,bind,(err,result)=>{
 		if(err) return callback(not)
 		callback(result)
 	})
 },
 saveDetailTicket:function (bind,callback){
 	let query = 'insert into `chitietvexe`(`MaVeXe`,`MaCX`,`SoGhe`,`DonGia`) values (?,?,?,?)'
 		let not = false;
 	mysqlDB.query(query,bind,(err,result)=>{
 		if(err) return  console.log("hghj")
 		callback(result)
 	})
 },
 updateTickets: function(tickets,postID, callback){
 	let query = 'update `chuyenxe` set `SoVeHienCon` =(select `SoVeHienCon` from `chuyenxe` where `MaCX`=?) - ? where MaCX=?'
 	let bind = [];
 	bind.push(postID);
 	bind.push(tickets);
 	bind.push(postID);
 		let not = false;
 	mysqlDB.query(query,bind,(err, result) =>{
 		if(err) return console.log("lôi day ne")
 			callback(result)
 	})
 },
 getAllCusId: function(callback){
 	let query = 'select `CMND` from `khachhang`'
 	mysqlDB.query(query,(err, result) =>{
 		if(err) return console.log("a mistake")
 			callback(result)
 		//console.log(result)
 	})
 }
 ,
 findCusById: function(id,callback){
 	let query = 'select `CMND` from `khachhang` where CMND=?';
 	let notdone =false;
 	mysqlDB.query(query,id,(err, result) =>{
 		if(err) return callback(notdone)
 			callback(result)
 	})
 }
 ,
 checkTicket:function(ticketId,callback){
 	let query = 'select * from `chitietvexe`,`vexe` where chitietvexe.MaVeXe = vexe.MaVeXe and chitietvexe.MaVeXe = ?';
 	mysqlDB.query(query,ticketId,(err, result) =>{
 		if(err) return callback(false)
 			callback(result)
 	})
 }
};