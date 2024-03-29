var express = require('express');
var router = express.Router();

/* GET ofertas listing. */
router.get('/', function(req, res, next) {
  const id = req.query.id === undefined ? null : req.query.id;
  const idProveedor = req.query.idProveedor === undefined ? null : req.query.idProveedor;
  const idComprador = req.query.idComprador === undefined ? null : req.query.idComprador;
  const idOferta = req.query.idOferta === undefined ? null : req.query.idOferta;
  const idEstado = req.query.idEstado === undefined ? null : req.query.idEstado;
  
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `SELECT * FROM Compra c WHERE c.IdCompra = COALESCE(${id}, c.IdCompra)
      AND c.IdProveedor = COALESCE(${idProveedor}, c.IdProveedor)
      AND c.IdComprador = COALESCE(${idComprador}, c.IdComprador)
      AND c.IdOferta = COALESCE(${idOferta}, c.IdOferta)
      AND c.IdEstado = COALESCE(${idEstado}, c.IdEstado)`, 
      (err, rows) => {
        if(err) res.json(err);
        res.json({rows});
    });
  });
});

//IdProveedor, IdComprador, IdOferta, Cantidad, Total, Descripcion, Observacion, Fecha, IdEstado, MetodoPago, PagadoAProveedor


router.post('/', (req, res, next) =>{
  const {IdProveedor, IdComprador, IdOferta, Cantidad, Total, Descripcion, Observacion, IdEstado, MetodoPago, PagadoAProveedor} = req.body;
  req.getConnection((err, conn) =>{
    if(err) return res.send(err);
    conn.query(
      `INSERT INTO Compra (IdProveedor, IdComprador, IdOferta, Cantidad, Total, Descripcion, Observacion, Fecha, IdEstado, MetodoPago, PagadoAProveedor) 
        VALUES (${IdProveedor},${IdComprador},${IdOferta},${Cantidad}, ${Total}, "${Descripcion}", "${Observacion}", NOW(), ${IdEstado}, "${MetodoPago}", ${PagadoAProveedor})`, 
      (err, rows) => {
        if(err) console.log(err);
        res.json(rows);
    });
  });
});

router.patch('/', (req, res, next) => {
  const {IdCompra, IdEstado, PagadoAProveedor} = req.body;
  console.log(req.body)
  req.getConnection((err, conn) => {
    if(err) return res.send(err);
    conn.query(
      `UPDATE Compra comp
        SET comp.IdEstado = COALESCE(${IdEstado}, comp.IdEstado), comp.PagadoAProveedor = COALESCE(${PagadoAProveedor}, comp.PagadoAProveedor)
        WHERE comp.IdCompra = COALESCE(${IdCompra}, comp.IdCompra)`,
      (err, rows) => {
        if(err) console.log(err);
        // enviarNotificacionTopic({
        //   title: "Oferta ha cambiado", 
        //   message: "Prueba", 
        //   token: "cihtSbtdqjnCsteQQZ10bW:APA91bFvDHZI1y5KR48Lus-zOn-SmAf_P2Plq49jtxxhsu60sQUJiaLm0I7PzPDKAdf43RWbsErONjwm7CJN5Gl6ZgZMJggJpJjXM62Mfoa7FRC_sbpT07JBLM0T_8mquEBWFdiiE-d9"
        // })
        res.json(rows);
      }
    )
  })
});

module.exports = router;