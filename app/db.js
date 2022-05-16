const mysql = require("mysql2/promise");

const createConnection = async () => {
  return await mysql.createConnection({
    host: "mysql-ag-br1-11.conteige.cloud",
    user: "yxyeuv_zap",
    port: 3306,
    password: "102030Brasil2020",
    database: "yxyeuv_zap",
  });
};

//Buscandoo Leads

const updateStage = async (user, stage) => {
  const connection = await createConnection();
  let [rows] = await connection.execute(
    "UPDATE leads SET stage = ? WHERE user = ?",
    [stage, user]
  );
  return rows;
};

const updateLeadName = async (user, fullname) => {
  const connection = await createConnection();
  let [rows] = await connection.execute(
    "UPDATE leads SET full_name = ? WHERE user = ?",
    [fullname, user]
  );
  return rows;
};


const updateShareCount = async (user, share_count) => {
  const connection = await createConnection();
  let [rows] = await connection.execute(
    "UPDATE leads SET share_count = ? WHERE user = ?",
    [share_count, user]
  );
  return rows;
};


const updateLeadPix = async (user, pix) => {
  const connection = await createConnection();
  let [rows] = await connection.execute(
    "UPDATE leads SET pixkey = ? WHERE user = ?",
    [pix, user]
  );
  return rows;
};


const updateQuestion = async (user, question) => {
  const connection = await createConnection();
  let [rows] = await connection.execute(
    "UPDATE leads SET question = ? WHERE user = ?",
    [question, user]
  );
  return rows;
};


const updateConversionType = async (user, data) => {
  const connection = await createConnection();
  let [rows] = await connection.execute(
    "UPDATE leads SET conversion_type = ? WHERE user = ?",
    [data, user]
  );
  return rows;
};

/*
result.id.user,
          result.id._serialized,
          lead, 
          'PRIZEID',
          'LEVELID'
*/
/*
const createLuckNumbers = async (lead_id, prize_id, length, active ) => {
  const connection = await createConnection();
  var luckNumbers = [];
   var values = []
  
  for (var i = 0; i < length; i++) {
    var number = helper.luckNumbers(3)
    values.push([lead_id, prize_id, number, active])  
    luckNumbers.push(`*${number}*`);
  }


  
  await connection.query("INSERT INTO luck_numbers (lead_id, prize_id, lucknumber, active) VALUES ? ", [values], function(err) {
    if (err) throw err;
    connection.end();
});

  return luckNumbers;
};
*/
const insertLead = async (
  user,
  _serialized,
  name,
  level,
  reference,
  starter,
  uuid,
  pic
) => {
  const connection = await createConnection();
  let [rows] = await connection.execute(
    "INSERT INTO leads SET user = ?, _serialized = ?, name = ?, level = ?, reference = ?, starter = ?, uuid = ?, pic = ?",
    [user, _serialized, name, level, reference, starter, uuid, pic]
  );
  return rows;
};


const insertBalance = async (user, value) => {
  const connection = await createConnection();
  let [rows] = await connection.execute(
    "INSERT INTO balance SET user = ?, value = ?",
    [user, value]
  );
  return rows;
};

const getBalance = async (user) => {

  const connection = await createConnection();
  let [rows] = await connection.execute(
    "SELECT SUM(value) AS Total FROM balance WHERE user = ?",
    [user]
  );
  return rows;
};



/*
const getLead = async (user) => {
  const connection = await createConnection();
  let [rows] = await connection.execute("SELECT * FROM leads WHERE user = ?", [
    user,
  ]);

  if (rows.length > 0) {
    //se houver um lead já cadastrado
    if (rows[0].stage == 0) {
      //se o lede foi cadastrado e ainda nao mandou msg
      let rows = stageUpdate(user, 1);
    }
    return rows;
  } else {
    let rows = await newLead(user, 0);
    return rows;
  }

  //if (rows.length > 0) return rows;
  //return false;
};
*/
const getLead = async (user) => {
  const connection = await createConnection();
  let [rows] = await connection.execute("SELECT * FROM leads WHERE user = ?", [
    user,
  ]);
  if (rows.length > 0) return rows;
  return false;
};

const getLeadbyUUID = async (uuid) => {
  const connection = await createConnection();
  let [rows] = await connection.execute("SELECT * FROM leads WHERE uuid = ?", [
    uuid,
  ]);
  if (rows.length > 0) return rows;
  return false;
};




const setUser = async (user) => {
  const connection = await createConnection();
  const [rows] = await connection.execute("INSERT INTO leads SET user = ?", [
    user,
  ]);
  if (rows.length > 0) return rows;
  return false;
};



module.exports = {
  createConnection,
  insertLead,
  getLead,
  getLeadbyUUID,
  insertBalance,
  getBalance,
  updateStage,
  updateConversionType,
  updateQuestion,
  updateLeadName,
  updateLeadPix,
  updateShareCount,
  setUser,

};

