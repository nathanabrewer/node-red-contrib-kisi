
module.exports = function(RED) {

    "use strict";

    var KisiClient = require('kisi-client');


    function kisiAccount(config) {
        // Create a RED node
        RED.nodes.createNode(this,config);
        var node = this;
        var kisi = new KisiClient({});
        //kisi.context.baseUrl = 'https://www.kisi.de';
        kisi.context.baseUrl = 'https://api.getkisi.com';
        this.kisi = kisi


        this.authenticate = function(){
          return this.kisi.authenticate(config.username, config.password);
        };

        this.getLocks = function(cb){
          this.authenticate().then(function(){
            kisi.get('locks', { limit: 100 }).then(function(response) {
               //return array object
               cb( response.body.items );
             });
          });
        };



      }

    RED.nodes.registerType("kisi-account",kisiAccount);


    //get available locks
    RED.httpAdmin.post("/kisi-account/:id", RED.auth.needsPermission("kisi.unlock"), function(req,res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.getLocks(function(locks){
                  res.send(locks);
                })




            } catch(err) {
                res.send(500);
                node.error(RED._("inject.failed",{error:err.toString()}));
            }
        } else {
            res.send(404);
        }
    });



}
